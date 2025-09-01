// app/prooverview/[id]/download/page.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function DownloadPage() {
  const { id } = useParams();
  const searchParams = useSearchParams(); // Add this line
  const [isGenerating, setIsGenerating] = useState(false);
  const hasGeneratedRef = useRef(false); // Track if we've already generated

  useEffect(() => {
    // Only generate on initial load if we haven't already
    if (!hasGeneratedRef.current) {
      generatePDF();
      hasGeneratedRef.current = true;
    }
  }, []);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
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

  const isExportMode = searchParams.get('export') === 'true';

  // Add this useEffect to set a data attribute when in export mode
  useEffect(() => {
    if (isExportMode && typeof document !== 'undefined') {
      document.body.setAttribute('data-export-ready', 'true');
    }
  }, [isExportMode]);

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Download Pro Overview</h1>
          <p className="text-gray-600">
            {isGenerating 
              ? "Generating PDF..." 
              : "Your download should start automatically. If not, click the button below."
            }
          </p>
        </div>
        
        {isGenerating && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            Generating PDF, please wait...
          </div>
        )}
        
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Download PDF Again"}
        </button>
      </div>
    </div>
  );
}