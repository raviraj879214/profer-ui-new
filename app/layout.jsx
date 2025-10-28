import "./globals.css";
import ClientLayout from "./ClientLayout";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
