
import React, { useState } from "react";
import { useForm } from "react-hook-form";



export function RejectPopup({sendData , id}) {
    const {register,handleSubmit , formState : {errors} } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [button,setButton] = useState(false);

    const onSubmit= async(data)=>{

        rejectprojectrequested(id , data.reason);
    }


    const rejectprojectrequested = async (id , reason) => {
        setButton(true);
  
  if (confirm("Are you sure you want to reject?")) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reject-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id , reason : reason }),
      });

      
      if (!res.ok) {
        console.error("Failed to reject project request");
        return;
      }

      const result = await res.json();

      if (result.data) {
        sendData("rejected");
      }
    } catch (error) {
      console.error("Error rejecting project request:", error);
    }
  }
  setButton(false);
};










  return (
<form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="bg-white rounded-2xl shadow-2xl  ml-4 p-5 relative flex flex-col">
      
      <h2 className="font-semibold text-gray-900 mb-3 text-lg">Enter Reason</h2>

    
      <textarea
        placeholder="Type your rejection reason..."
        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register("reason", { required: "Please enter reason" })}
      ></textarea>
    {errors.reason && <p className="text-red-500 text-xs mt-2">{errors.reason.message}</p>
    }
      {/* Footer */}
     <div className="mt-2 border-t border-gray-200 pt-3 flex flex-col gap-2">
  <p className="text-xs text-gray-500">
    Please ensure the reason is clear and concise before submitting.
  </p>
  <button
    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1E1E3E] self-end"
  >
    {button ? "Loading..." : "Confirm & Send"}
  </button>
</div>

    </div>
</form>
  );
}
