import Link from "next/link";
import { useState, useEffect } from "react";

export function ProCredentialList() {
  const [credentialData, setCredentialData] = useState([]);
  const ApiUrl = `${process.env.NEXT_PUBLIC_URL}/api/get-credential-list`;

  function groupBySection(data) {
    const grouped = {};

    data.forEach((item) => {
      if (!grouped[item.section]) {
        grouped[item.section] = {
          title: item.section,
          icon: (
            <img
              src="/images/licensed.png"
              alt={`${item.section} Icon`}
              className="w-5 h-5 object-contain"
            />
          ),
          contents: [],
        };
      }
      grouped[item.section].contents.push({
        text: item.name,
        image: item.fileUrl,
        alt: item.name,
      });
    });

    return Object.values(grouped);
  }

  async function fetchCredentialsData() {
    try {
      const userid = localStorage.getItem("UserID");
      const token = localStorage.getItem("token");

      const res = await fetch(ApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200 && Array.isArray(result.data)) {
          const groupedData = groupBySection(result.data);
          setCredentialData(groupedData);
        } else {
          setCredentialData([]);
        }
      } else {
        setCredentialData([]);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
      setCredentialData([]);
    }
  }

  useEffect(() => {
    fetchCredentialsData();
  }, []);

  function isPdf(url) {
    return url.toLowerCase().endsWith(".pdf");
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Credentials</h3>
        <Link
          href="/pro/pro-credentials"
          className="text-blue-400 text-xs hover:underline cursor-pointer"
        >
          View Credentials
        </Link>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-[600px]">
        {credentialData.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No credentials found.</p>
        ) : (
          credentialData.map((section, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <h4 className="font-semibold text-gray-700 text-xs">{section.title}</h4>
                </div>
              </div>
              <div className="space-y-4">
               

                {section.contents.map((content, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-600 truncate mb-1">{content.text}</p>
                    {isPdf(content.image) ? (
                      <embed
                        src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${content.image}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        width="100%"
                        height="400px"
                        className="border border-gray-300 rounded"
                      />
                    ) : (
                      <img
                        src={`${process.env.NEXT_PUBLIC_URL}/api/files?filepath=${content.image}`}
                        alt={content.alt}
                        className="w-full h-40 object-contain border border-gray-300 rounded"
                      />
                    )}
                  </div>
                ))}


              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
