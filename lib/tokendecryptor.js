

// utils/tokendecryptor.js
import { jwtDecode } from "jwt-decode";




export const tokendecryptor = () => {

  const token = localStorage.getItem("token");

  if (!token) return null;

  const decoded = jwtDecode(token);

  return decoded.id;  
};
