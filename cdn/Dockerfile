FROM rust:1.72 as builder

WORKDIR /usr/src/app

COPY Cargo.toml Cargo.lock ./

RUN mkdir src && echo "fn main() {}" > src/main.rs

RUN cargo build --release
RUN rm -rf target/release/deps/cdn*

COPY . .

RUN cargo build --release

FROM debian:buster-slim

COPY --from=builder /usr/src/app/target/release/cdn /usr/local/bin/cdn

CMD ["cdn"]
