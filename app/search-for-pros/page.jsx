"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchForPros } from "@/components/Frontend/Searchforpros/Searchforpros";




// Inner component that actually uses useSearchParams
function SearchForContent() {
  const searchParams = useSearchParams();

  
  const name = searchParams.get("name") || "";
  const zip = searchParams.get("zip") || "";

  return <SearchForPros companyname={name} zipcode={zip} />;


}





// Page component with Suspense boundary
export default function SearchFor() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <p>test</p>
      
      <SearchForContent />
    </Suspense>
  );
}
