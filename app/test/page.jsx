"use client"
import { useForm } from "react-hook-form";




export  default function Page(){

  const {register , handleSubmit, reset,formState :{errors}} = useForm();


  const onsumbit = (data) =>{
    reset();
  }


  return(<>

      <form  onSubmit={handleSubmit(onsumbit)} className="mt-20">

      <input type="text" id="" className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
       {...register("email",{required:"Email required",
        pattern : {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email address"
        }
       }
      
       )} 
      />
       {errors.email && <p>{errors.email.message}</p>}
       <button type="submit">Submit</button>
      </form>

  
  </>);
}