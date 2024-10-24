"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Alert from "@/components/Alert";
import { FaExclamationTriangle } from "react-icons/fa";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface Location {
  lat: number;
  lng: number;
}

import React from "react";

const Page = () => {
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [addressDetails, setAddressDetails] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!location || !imageFile) {
      setMessage({
        text: "Pakiusap, pumili ng lokasyon at mag-upload ng larawan.",
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await fetch("http://localhost:5300/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload the image.");
      }

      const imageUrl = await uploadResponse.text();

      console.log(imageUrl);

      const reportData = {
        description,
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        address: addressDetails.address,
        city: addressDetails.city,
        state: addressDetails.state,
        country: addressDetails.country,
        postalCode: addressDetails.postalCode,
        imageUrl: `http://localhost:5300` + imageUrl,
      };

      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (res.ok) {
        setMessage({
          text: "Matagumpay na naisumite ang ulat!",
          type: "success",
        });
        setDescription("");
        setImageFile(null);
        setLocation(null);
        setAddressDetails({
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        });
      } else {
        const data = await res.json();
        setMessage({
          text: data.error || "May problema sa pagsusumite ng ulat.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        text: "May problema sa koneksyon. Subukan muli mamaya.",
        type: "error",
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-xl rounded-lg p-8 md:w-3/4 lg:w-2/3 mx-auto">
        <div className="flex items-center justify-center mb-8">
          <FaExclamationTriangle className="text-red-500 text-4xl sm:text-5xl mr-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Mag-ulat ng Sakuna
          </h1>
        </div>
        {message && <Alert message={message.text} type={message.type} />}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="h-80 border rounded-lg overflow-hidden shadow-sm">
            <Map
              setLocation={setLocation}
              setAddressDetails={setAddressDetails}
            />
          </div>
          <div className="text-black">
            <p className="text-sm sm:text-base md:text-lg">
              Address: {addressDetails.address}
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              Lungsod: {addressDetails.city}
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              Estado: {addressDetails.state}
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              Bansa: {addressDetails.country}
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              Postal Code: {addressDetails.postalCode}
            </p>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2"
            >
              Paglalarawan <span className="text-gray-500">(opsyonal)</span>
            </label>
            <textarea
              id="description"
              placeholder="Ilarawan ang sitwasyon..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32"
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2"
            >
              Mag-upload ng Larawan
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6
                         file:rounded-md file:border-0 file:text-sm file:font-medium
                         file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600
                       transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400
                       text-sm sm:text-base md:text-lg"
          >
            Isumite ang Ulat
          </button>
        </form>
        <div className="mt-3 text-center">
          <Link
            href="/reports"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold
                         hover:bg-blue-600 transition duration-200 focus:outline-none
                         focus:ring-2 focus:ring-blue-400 text-sm sm:text-base md:text-lg"
          >
            Tingnan ang Mga Ulat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
