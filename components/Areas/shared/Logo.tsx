import Link from "next/link";



export function Logo({ isFooter = false }) {
  return (
    <div className={`flex items-center space-x-2 ${isFooter ? "text-white" : ""}`}>
     <Link href={'https://www.profer.com'}>
     
     <img
        src="/images/Logo.png"
        alt="Secondary Logo"
        className="h-18 w-auto object-contain"
      />


     </Link>
      

    </div>
  );
}
