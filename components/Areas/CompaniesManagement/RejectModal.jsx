import React, { useState } from "react";
import { useForm } from "react-hook-form";

export function RejectPopup({ sendData, userid }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [button, setbutton] = useState(false);

  const onSubmit = async (data) => {
    if (!confirm("Are you sure you want to reject this?")) {
      return null; // user pressed Cancel
    }
    setbutton(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/reject-companies/${userid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
          },
          body: JSON.stringify({
            rejectReason: data.reason,
          }),
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.status === 200) {
          
          sendData("reject");
        }
      }
    } catch (err) {
      console.error("Error rejecting company:", err);
    } finally {
      setbutton(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full  p-5 relative flex flex-col">
      {/* Close Button */}
     

      {/* Header */}
      <h2 className="font-semibold text-gray-900 mb-3 text-lg">Enter Reason</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Textarea */}
        <textarea
          placeholder="Type your rejection reason..."
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("reason", { required: "Please enter reason" })}
        ></textarea>
        {errors.reason && <p className="text-red-500 text-xs">{errors.reason.message}</p>}

        {/* Footer */}
       <div className="mt-2 border-t border-gray-200 pt-3 flex flex-col gap-2">
  <p className="text-xs text-gray-500">
    Please ensure the reason is clear and concise before submitting.
  </p>
  <button
    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1E1E3E] self-end"
    type="submit"
  >
    {button ? "Rejecting.." : "Reject"}
  </button>
</div>


      </form>
    </div>
  );
}
