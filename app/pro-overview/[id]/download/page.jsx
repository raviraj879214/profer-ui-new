// app/prooverview/[id]/download/page.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function DownloadPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (!hasGeneratedRef.current) {
      generatePDF();
      hasGeneratedRef.current = true;
    }
  }, []);

  
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `pro-overview-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isExportMode = searchParams.get("export") === "true";
  useEffect(() => {
    if (isExportMode && typeof document !== "undefined") {
      document.body.setAttribute("data-export-ready", "true");
    }
  }, [isExportMode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Pro Overview PDF Download
        </h1>
        <p className="text-gray-600 mb-6">
          {isGenerating
            ? "We’re preparing your PDF. Please wait a moment..."
            : "Your download should start automatically. If not, you can retry below."}
        </p>

        {isGenerating && (
          <div className="flex flex-col items-center justify-center space-y-4 mb-6">
            {/* Tailwind CSS spinner */}
            <div className="w-12 h-12 border-4 border-[#0C0C2D] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#0C0C2D] font-medium">
              Generating your PDF...
            </span>
          </div>
        )}

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-[#0C0C2D] hover:bg-[#0C0C2D]-700 text-white font-semibold px-5 py-2 rounded-lg shadow disabled:opacity-50 transition-colors"
        >
          {isGenerating ? "Generating..." : "Download PDF Again"}
        </button>
      </div>
    </div>
  );
}
