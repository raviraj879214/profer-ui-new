'use client';

import { useEffect, useState } from 'react';


import { useRouter } from "next/navigation";
export default function PrivacyPolicyPage() {
  const [cmsText, setCmsText] = useState('');
  const [error, setError] = useState(null);
 const router = useRouter();
  useEffect(() => {
    async function fetchCmsText() {
        try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cmsterms?pageName=Termsconditions`);

      if (!res.ok) {
        alert("error");
        // Try to extract error message from server response
        const errorData = await res.json();
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (!data.CmsText) {
        throw new Error('CmsText not found in response');
      }

      setCmsText(data.CmsText);
    } catch (err) {
      console.error('Error fetching CMS content:', err);
      setError(err.message);  // Show specific error
    }
  }

  fetchCmsText();
}, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Terms And Conditions</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: cmsText }}
        />
      )}
    </main>
  );
}
