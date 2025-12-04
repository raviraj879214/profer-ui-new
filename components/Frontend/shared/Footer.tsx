"use client";

import { Logo } from "@/components/Areas/shared/Logo";
import { SubscriberForm } from "../../Frontend/Subscriber/Subscriberui";
import Link from "next/link";

export function Footer() {
  return (
    <footer className=" bg-gray-900 text-gray-200 py-10 px-6">
      <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-between gap-6">
        
        {/* Logo + Copyright */}
        <div className="flex items-center space-x-2">
            <Link href={'https://www.profer.com'}>
     
              <img
                  src="/images/profer-logo-footer.png"
                  alt="Secondary Logo"
                  className="h-18 w-auto object-contain"
                />


     </Link>
          <span className="text-sm">© 2025 Profer</span>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm underline">
          <a target="_blank" href="https://www.profer.com/terms">Terms & Privacy</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Subscriber Form */}
        {/* <div className="w-full sm:w-auto">
          <SubscriberForm />
        </div> */}

        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src="https://static.wixstatic.com/media/8de7f9_25a88ba476834e24a16b06802ff19127~mv2.png/v1/crop/x_0,y_223,w_1654,h_1135/fill/w_650,h_444,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/profer_projects_edited.png"
            alt="Illustration showing two characters working with a ladder and tools"
            className="h-24 w-auto object-contain mx-auto md:mx-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </footer>
  );
}
