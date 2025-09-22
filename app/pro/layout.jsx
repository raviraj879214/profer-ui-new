
"use client"
import {ProHeader} from "../../components/ProsArea/shared/ProHeader";
import {ProFooter} from "../../components/ProsArea/shared/ProFooter";
import  {AuthGuardPro} from "../../components/adminguard/AuthGuardPro";
import {ProDashBoardHero} from "../../components/ProsArea/shared/ProDashBoardCard";
import { usePathname } from "next/navigation";



export default function ProLayout({ children }) {

  const pathname = usePathname();

  // hide component on specific routes
  const hiddenPaths = ["/pro/step-1", "/pro/step-2", "/pro/step-3"];
  const shouldHideHero = hiddenPaths.includes(pathname);


  return ( <>
    <AuthGuardPro>

        {!shouldHideHero && <ProDashBoardHero />}
   
        {/* <ProHeader></ProHeader> */}
        {children}
        {/* <ProFooter></ProFooter> */}
    </AuthGuardPro>
   </>);
}
