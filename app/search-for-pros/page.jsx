
"use client"
import { SearchForPros } from "@/components/Frontend/Searchforpros/Searchforpros";
import { Metadata } from "next";
import { useSearchParams } from "next/navigation";







export default function SearchFor(){

  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "";
  const zip= searchParams.get("zip") || "";

    return(<>
       
       <SearchForPros companyname= {name} zipcode= {zip}/>
    
    </>);
}