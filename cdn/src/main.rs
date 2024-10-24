use actix_cors::Cors;
use std::env;
use std::path::PathBuf;

use actix_files::NamedFile;
use actix_multipart::Multipart;
use actix_web::{middleware::Logger, web, App, Error, HttpResponse, HttpServer, Result};
use dotenv::dotenv;
use futures_util::StreamExt;
use log::{error, info};
use tokio::io::AsyncWriteExt;
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    upload_dir: String,
}

async fn get_image(
    path: web::Path<String>,
    data: web::Data<AppState>,
) -> Result<NamedFile, Error> {
    let filename = path.into_inner();
    let mut file_path = PathBuf::from(&data.upload_dir);
    file_path.push(&filename);

    Ok(NamedFile::open(file_path)?)
}

async fn upload_image(
    mut payload: Multipart,
    data: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    let mut file_saved = false;
    let mut unique_filename = String::new();

    const MAX_FILE_SIZE: usize = 5 * 1024 * 1024;

    while let Some(item) = payload.next().await {
        match item {
            Ok(mut field) => {
                let content_type = field.content_type();
                let subtype = content_type.subtype();

                let file_extension = if subtype == mime::JPEG {
                    "jpg"
                } else if subtype == mime::PNG {
                    "png"
                } else if subtype == mime::GIF {
                    "gif"
                } else {
                    error!("Unsupported media subtype: {}", subtype);
                    return Ok(HttpResponse::UnsupportedMediaType().body(
                        "Only JPEG, PNG, and GIF images are allowed",
                    ));
                };

                unique_filename = format!("{}.{}", Uuid::new_v4(), file_extension);
                let mut filepath = PathBuf::from(&data.upload_dir);
                filepath.push(&unique_filename);

                let mut f = tokio::fs::File::create(&filepath)
                    .await
                    .map_err(actix_web::error::ErrorInternalServerError)?;

                let mut total_size = 0;

                while let Some(chunk) = field.next().await {
                    let data = chunk.map_err(actix_web::error::ErrorInternalServerError)?;
                    total_size += data.len();
                    if total_size > MAX_FILE_SIZE {
                        error!("File size exceeds limit: {} bytes", total_size);
                        return Ok(
                            HttpResponse::PayloadTooLarge().body("File size exceeds limit")
                        );
                    }
                    f.write_all(&data)
                        .await
                        .map_err(actix_web::error::ErrorInternalServerError)?;
                }

                file_saved = true;
                break;
            }
            Err(e) => {
                error!("Error processing file: {}", e);
                return Ok(
                    HttpResponse::BadRequest().body("Failed to process the uploaded file")
                );
            }
        }
    }

    if file_saved {
        let file_url = format!("/uploads/{}", unique_filename);
        info!("File uploaded successfully: {}", file_url);
        Ok(HttpResponse::Ok().body(file_url))
    } else {
        error!("No file uploaded in the request body");
        Ok(HttpResponse::BadRequest().body("No file uploaded in the body"))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok(); 
    env_logger::init();

    let upload_dir = env::var("UPLOAD_DIR").unwrap_or_else(|_| "./uploads".to_string());
    std::fs::create_dir_all(&upload_dir)?;

    let app_state = AppState {
        upload_dir: upload_dir.clone(),
    };

    let bind_address = env::var("BIND_ADDRESS").unwrap_or_else(|_| "127.0.0.1:5300".to_string());

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::default() 
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![actix_web::http::header::CONTENT_TYPE])
                    .allow_any_header()
                    .supports_credentials() 
                    .max_age(3600), 
            )
            .app_data(web::Data::new(app_state.clone()))
            .route("/uploads/{image_name}", web::get().to(get_image))
            .route("/upload", web::post().to(upload_image))
    })
    .bind(&bind_address)?
    .run()
    .await
}
