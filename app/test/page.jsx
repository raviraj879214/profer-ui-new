"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";




export  default function Page(){

  const [count,setcount] = useState(0);




  return(<>
 <>
  
    <div>
      count is : {count}
<br></br>
      <button className="bg-gray-900 text-white" onClick={() => setcount(count + 1)}>
        Increment Count by {count}
      </button>
    </div>


 
 </>

  
  </>);
}