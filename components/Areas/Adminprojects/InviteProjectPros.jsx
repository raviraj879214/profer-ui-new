"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";



export function ProjectInvite({ modalstatus, onClose , projectrequestid , onSuccess }) {


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [message,setmessage] = useState("");
  const [invitebutton,setinvitebutton] = useState(false);



  const handleInvite =async (data) => {
    debugger;
    setinvitebutton(true);
    console.log("Inviting:", data);

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/add-pros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        "emailId" : data.email,
        "name" : data.name,
        "projectid" : projectrequestid
      })
    });
    debugger;
    if(res.ok){
      const result = await res.json();
      if(result.status == 409){
        setmessage(result.message);
       
      }
       
       onSuccess(result.invite.id);
       onClose(); 
    }

    reset(); 
    // onClose(); 
    setinvitebutton(false);
  };

  if (!modalstatus) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-100 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-80 sm:w-96 transform transition-transform duration-200 scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Invite Pros to Project</h2>
        {message}
        <form onSubmit={handleSubmit(handleInvite)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Please enter name" })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Please enter email address" })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#0C0C2D] text-white font-semibold hover:bg-[#1a1a44] transition">

              {invitebutton ? "Inviting" : "Invite"}

            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
