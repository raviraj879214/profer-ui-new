
import { NextResponse } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();

  

  // Assign global values
  res.headers.set("x-price-id", "price_1S0HJWGdOIhoJtRKuoHTa3Lz");
  res.headers.set("x-custom-field", "something");


  return res;
}
