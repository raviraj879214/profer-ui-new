"use client"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";






export function ProUpdate() {

    const {register,handleSubmit,formState:{errors},setValue } = useForm();
    const [message , setMessage] = useState();
    const [button,setButton] = useState(false);

    const fetchprosdetails = async ()=>{
        const userid = localStorage.getItem("UserID");
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pros-get-details/${userid}`,{
            headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
        });

        if(res.ok)
        {
            const result  = await res.json();

            if(result.status == 200){
                console.log("pros details",result);
                setValue("firstname",result.data.firstname);
                setValue("email",result.data.email);
                setValue("lastname",result.data.lastname);
                setValue("address",result.data.address);
                setValue("city",result.data.city);
                setValue("state",result.data.state);
                setValue("zipCode",result.data.zipCode);
            }
        }

    }



    useEffect(()=>{
        fetchprosdetails();
    },[message]);





    const OnSubmit = async (data)=>{
        setButton(true);
          const token = localStorage.getItem("token");
           const userid = localStorage.getItem("UserID");
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pros-update-profile`,{
                method : "POST",
                headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    "id" : userid,
                    "firstname" : data.firstname,
                    "lastname" : data.lastname,
                    "email" : data.email,
                    "address" : data.address,
                    "city" : data.city,
                    "state" : data.state,
                    "zipCode" : data.zipCode
                })
            });

            if(res.ok){
                const result = await res.json();
                if(result.status == 200){
                    setMessage("Pros updated successfully");
                }
            }

            setTimeout(() => {
            setMessage("");
            }, 5000); // 5 seconds
            setButton(false);
    }









  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
        <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
        <p className="text-green-700">{message}</p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(OnSubmit)}>
          

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                disabled={true}
              type="email"
             
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
             {...register("email")}/>
            
          </div>

         {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstname"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              {...register("firstname",{required : "Please enter firstname"})}
            />
            {
                errors.firstname && <p className="text-red-500 text-sm mb-1">{errors.firstname.message}</p>
            
            }
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
             
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              {...register("lastname",{required : "Please enter lastname"})}

            />
            {errors.lastname && <p className="text-red-500 text-sm mb-1">{errors.lastname.message}</p>}

          </div>
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              {...register("address",{required : "Please enter address"})}
            />
            {errors.address && <p className="text-red-500 text-sm mb-1">{errors.lastname.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              {...register("city",{required : "Please enter city"})}
            />
            {errors.city && <p className="text-red-500 text-sm mb-1">{errors.city.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              {...register("state",{required : "Please enter state"})}
            />
            {errors.state && <p className="text-red-500 text-sm mb-1">{errors.state.message}</p>}
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              {...register("zipCode", { 
                    required: "Please enter zip code",
                    pattern: {
                        value: /^[0-9]{5,9}$/,
                        message: "Please enter a valid zip code"
                    }
                })}

            />
            {errors.zipCode && <p className="text-red-500 text-sm mb-1">{errors.zipCode.message}</p>}

          </div>

         

          {/* Submit button (full width) */}
          <div className="md:col-span-2">
            <button
            disabled = {button}
              type="submit"
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring"
            >
              
              {button ? "Updating ..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
