"use client";

import { useState } from "react";
import Image from "next/image";
import { Report } from "@prisma/client";
import { format } from "date-fns";

interface ReportsListProps {
  reports: Report[];
}

const ReportsList = ({ reports }: ReportsListProps) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const openModal = (report: Report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Mga Ulat</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => openModal(report)}
          >
            <Image
              src={report.imageUrl}
              alt="Larawan ng Ulat"
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-gray-700 mb-2">
                {report.description || "Walang paglalarawan na ibinigay."}
              </p>
              <div className="text-sm text-gray-500 mb-2">
                <p>Lokasyon:</p>
                <p>
                  Address:{" "}
                  {report.address
                    ? report.address
                    : "Walang address na makukuha"}
                </p>
                <p>
                  Lungsod/Estado:{" "}
                  {report.city && report.state
                    ? `${report.city}, ${report.state}`
                    : report.city || report.state || "Walang Lungsod/Estado"}
                </p>
                <p>Bansa: {report.country || "Walang Bansa"}</p>
                <p>Postal Code: {report.postalCode || "Walang postal code"}</p>
                <p>
                  Mga Coordinate: {report.latitude.toFixed(2)},{" "}
                  {report.longitude.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Naiulat noong:{" "}
                {format(new Date(report.createdAt), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Detalye ng Ulat</h2>
            <Image
              src={selectedReport.imageUrl}
              alt="Larawan ng Ulat"
              width={400}
              height={300}
              className="w-full h-48 object-cover mb-4"
            />
            <p className="text-gray-700 mb-2">
              {selectedReport.description || "Walang paglalarawan na ibinigay."}
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <p>Lokasyon:</p>
              <p>
                Address:{" "}
                {selectedReport.address
                  ? selectedReport.address
                  : "Walang address na makukuha"}
              </p>
              <p>
                Lungsod/Estado:{" "}
                {selectedReport.city && selectedReport.state
                  ? `${selectedReport.city}, ${selectedReport.state}`
                  : selectedReport.city ||
                    selectedReport.state ||
                    "Walang Lungsod/Estado"}
              </p>
              <p>Bansa: {selectedReport.country || "Walang Bansa"}</p>
              <p>
                Postal Code: {selectedReport.postalCode || "Walang postal code"}
              </p>
              <p>
                Mga Coordinate: {selectedReport.latitude.toFixed(2)},{" "}
                {selectedReport.longitude.toFixed(2)}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Naiulat noong:{" "}
              {format(new Date(selectedReport.createdAt), "dd/MM/yyyy")}
            </p>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Isara
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsList;
