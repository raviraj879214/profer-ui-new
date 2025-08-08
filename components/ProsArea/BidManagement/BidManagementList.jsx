"use client"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";







export function Bid(){
    const [location, setLocation] = useState("All locations");
    const locations = ["All locations", "Location 1", "Location 2"];
    const [closedProjects,setclosedProjects] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [message,setmessage] = useState("");
   
    const {register,handleSubmit,setValue,getValues,reset,formState : {errors}} = useForm();
    const [projectid,setprojectid] = useState();


    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
            setmessage("");
            }, 5000); // 5 seconds
            return () => clearTimeout(timer); // Cleanup on unmount or when message changes
        }
        }, [message]);


    const  fetchprojectlist = async ()=>{
        const UserID = localStorage.getItem("UserID");
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-project-details/${UserID}`,{
                            headers: {
                                 "Authorization": `Bearer ${token}`,
                                },
                          });
            if(res.ok){
                const result  = await res.json();
                if(result.status == 200)
                {
                    setclosedProjects(result.data);
                }
            }       
    }


    useEffect(()=>{
        fetchprojectlist();
    },[isOpen]);


   const Onsubmit = async (data) => {
            const proid = localStorage.getItem("UserID");
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/create-bid`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: data.bid,
                    message: data.message,
                    projectId: projectid,
                    proId : proid
                }),
                });

                const result = await res.json();
                if (res.ok && result.status === 200) {
                setmessage("Bid submitted successfully!");
                setIsOpen(false);
                } else {
                setmessage(result.message || "Failed to submit bid.");
                }
            } catch (error) {
                
                setmessage("Something went wrong!");
            }
            };


    const makebidpopup = async(id)=>{
        setIsOpen(true);
        setprojectid(id);
    }

    



    return(<>
      <main className="w-full max-w-5xl mx-auto flex flex-col">
        <section className="flex mt-6 w-full max-w-full">
          <aside className="flex flex-col space-y-3 bg-sky-200 w-36 p-5 rounded-tl-lg rounded-bl-lg text-gray-600 text-sm font-medium">
            <span className="cursor-pointer font-bold text-gray-900 border-l-4 border-sky-500 pl-3">
              Bids
            </span>
          </aside>

          <article className="flex-1 bg-white p-6 rounded-tr-lg rounded-br-lg drop-shadow-md overflow-x-auto">
           {message && (
                <p className="text-green-500 transition-opacity duration-500">{message}</p>
                )}


            <table className="w-full border-collapse">
              <thead className="border-b border-gray-200">
                <tr className="text-left text-gray-800 font-semibold text-sm">
                  <th className="py-3 px-6">Project Name</th>
                  <th className="py-3 px-6">Project Type</th>
                  <th className="py-3 px-6">End Date</th>
                  <th className="py-3 px-6">Budget</th>
                  
                   <th className="py-3 px-6">Bid</th>
                </tr>
              </thead>
              <tbody>

              {closedProjects.length > 0 ? (
  closedProjects.map(({ projectTitle, propertyType, enddate, budget, id, bids }) => {
    const latestBid = bids.length > 0 
      ? bids[bids.length - 1].amount 
      : "No Bids Yet";
    return (
      <tr key={id} className="even:bg-gray-50 odd:bg-white hover:bg-gray-100 cursor-pointer">
        <td className="py-4 px-6">{projectTitle}</td>
        <td className="py-4 px-6">{propertyType}</td>
        <td className="py-4 px-6">{enddate}</td>
        <td className="py-4 px-6 font-semibold">{budget ? budget : "Not Mentioned"}</td>
        <td className="py-4 px-6">
          {latestBid !== "No Bids Yet" ? (
            <p className="inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow text-sm">
              Bid: <span className="text-green-900">₹{latestBid}</span>
            </p>
          ) : (
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
              onClick={() => makebidpopup(id)}
            >
              Make Bid
            </button>
          )}
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="5" className="py-6 text-center text-gray-500">
      No records found
    </td>
  </tr>
)}

              </tbody>
            </table>
          </article>
        </section>




                {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-lg mx-auto">
            <div className="relative bg-white rounded-xl shadow-lg dark:bg-gray-800">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Bid Here
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full w-8 h-8 flex items-center justify-center dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                    </svg>
                </button>
                </div>

                {/* Body */}
                <div className="p-6">
                <form onSubmit={handleSubmit(Onsubmit)} className="space-y-5">
                    {/* Bid Amount */}
                    <div>
                    <label className="block text-left text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                        Bid Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter bid amount..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("bid", { 
                        required: "Please enter bid amount",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid integer"
                        }
                        })}
                    />
                    {errors.bid && (
                        <p className="text-red-500 text-sm mt-1">{errors.bid.message}</p>
                    )}
                    </div>

                    {/* Optional Message */}
                    <div>
                    <label className="block text-left text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                        Message (Optional)
                    </label>
                    <textarea
                        placeholder="Enter a message..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        {...register("message")}
                    />
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                    >
                        Submit Bid
                    </button>
                    </div>
                </form>
                </div>
                    
            </div>
            </div>
        </div>
)}







      </main>
    
    </>);
}