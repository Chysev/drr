"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { FaLocationArrow } from "react-icons/fa";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface MapProps {
  setLocation: (location: { lat: number; lng: number }) => void;
  setAddressDetails: (details: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) => void;
}

export default function Map({ setLocation, setAddressDetails }: MapProps) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [map, setMap]: any = useState<L.Map | null>(null);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  const provider = new OpenStreetMapProvider();

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch address details");
      }
      const data = await response.json();
      const addressDetails = {
        address: data.display_name || "",
        city:
          data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        country: data.address.country || "",
        postalCode: data.address.postcode || "",
      };
      setAddressDetails(addressDetails);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleResultSelected = (result: any) => {
    const latLng = new L.LatLng(result.y, result.x);
    setPosition(latLng);
    setLocation({ lat: latLng.lat, lng: latLng.lng });
    reverseGeocode(latLng.lat, latLng.lng);
    if (map && map.flyTo) {
      map.flyTo(latLng, 13);
    }
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latLng = new L.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setPosition(latLng);
          setLocation({ lat: latLng.lat, lng: latLng.lng });
          reverseGeocode(latLng.lat, latLng.lng);
          if (map && map.flyTo) {
            map.flyTo(latLng, 13);
          }
          setLoading(false);
        },
        (error) => {
          console.error(error);
          alert("Unable to retrieve your location");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  };

  const SearchField = () => {
    const map = useMap();

    useEffect(() => {
      const searchControl = new (GeoSearchControl as any)({
        provider,
        style: "bar",
        showMarker: false,
        autoClose: true,
        retainZoomLevel: false,
      });

      map.addControl(searchControl);

      map.on("geosearch/showlocation", (result: any) => {
        handleResultSelected(result.location);
      });

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[12.8797, 121.774]}
        zoom={5}
        className="h-full w-full rounded-md overflow-hidden"
        whenReady={setMap}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchField />
        <LocationMarker />
      </MapContainer>

      <button
        onClick={handleLocateUser}
        className="absolute top-2 right-2 z-50 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        title="Use My Location"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : (
          <FaLocationArrow />
        )}
      </button>
    </div>
  );
}
