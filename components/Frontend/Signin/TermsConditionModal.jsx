import { useEffect, useState } from "react";
import { formatDateToUS } from "../../../lib/utils/dateFormatter";

export function TermsConditionModal({ isOpen, onClose , userid }) {
  const [cmsText, setCmsText] = useState("");
  const [updatedAt, setUpdatedAt] = useState();
   const [button,setbutton] = useState(false);


  useEffect(() => {
    
    async function fetchCmsText() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/cmsterms?pageName=Termsconditions`
        );

        if (!res.ok) {
          alert("error");
          const errorData = await res.json();
          throw new Error(
            errorData.error || `Request failed with status ${res.status}`
          );
        }

        const data = await res.json();

        if (!data.CmsText) {
          throw new Error("CmsText not found in response");
        }
        setUpdatedAt(data.lastmodified);
        setCmsText(data.CmsText);
      } catch (err) {
        console.error("Error fetching CMS content:", err);
      }
    }

    fetchCmsText();
  }, []);

  if (!isOpen) return null;




  const onAccept = async () =>{
    setbutton(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/accept-terms/${userid}`);

    if(res.ok){
        const result = await res.json();
        if(result.status == 200){

            setTimeout(() => {
                onClose();
                window.location.reload(); 
            }, 2000); // wait 2 seconds
        }
    }
    setbutton(false);
  }












  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Terms of Service 
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {formatDateToUS(updatedAt)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 
              rounded-lg text-sm w-8 h-8 flex justify-center items-center 
              dark:hover:bg-gray-600 dark:hover:text-white mt-3 md:mt-0"
          >
            ✕
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="p-4 md:p-5 space-y-4 overflow-y-auto flex-1">
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: cmsText }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            onClick={() => {
             onAccept();
              
            }}
            className="text-white bg-[#0C0C2D] hover:bg-[#0C0C2D] focus:ring-4 focus:outline-none 
              focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
           
            {!button ? " I Accept" : "....."}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none 
              bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 
              focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 
              dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
              dark:hover:text-white dark:hover:bg-gray-700"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
