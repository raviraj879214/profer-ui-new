
import ProHeader from "../../components/ProsArea/shared/ProHeader";
import {ProFooter} from "../../components/ProsArea/shared/ProFooter";




export default function ProLayout({ children }) {
  return ( <>
   
        <ProHeader></ProHeader>
        {children}
       <ProFooter></ProFooter>


   </>);
}
