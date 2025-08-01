
import {ProHeader} from "../../components/ProsArea/shared/ProHeader";
import {ProFooter} from "../../components/ProsArea/shared/ProFooter";
import  {AuthGuardPro} from "../../components/adminguard/AuthGuardPro";
import {ProDashBoardHero} from "../../components/ProsArea/shared/ProDashBoardCard";


export default function ProLayout({ children }) {
  return ( <>
   
        
    <AuthGuardPro>
        <ProHeader></ProHeader>

        <ProDashBoardHero></ProDashBoardHero>
        {children}
        <ProFooter></ProFooter>
    </AuthGuardPro>

   </>);
}
