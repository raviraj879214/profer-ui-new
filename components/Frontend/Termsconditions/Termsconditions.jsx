'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import {formatDateToUS} from "../../../lib/utils/dateFormatter";


export default function PrivacyPolicyPage() {
  const [cmsText, setCmsText] = useState('');
  const [updatedAt,setupdatedAt] = useState();
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
      setupdatedAt(data.lastmodified);
      setCmsText(data.CmsText);
    } catch (err) {
      console.error('Error fetching CMS content:', err);
      setError(err.message);  // Show specific error
    }
  }

  fetchCmsText();
}, []);

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Profer, Inc. Terms of Use & Privacy Policy</h1>

      <h3 className=''>Last Modified: {formatDateToUS(updatedAt)}</h3>

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
