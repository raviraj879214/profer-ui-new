"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";




export function HomeHero() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter();

    const onsubmit = (data) =>{

        router.push(`/search-for-pros?name=${data.companyname}&zip=${data.zipcode}`)

    }


    return (<>


       <section className="bg-white px-6 sm:px-12 md:px-24 py-12 md:py-20">
  <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto gap-12 md:gap-0">

    {/* Left Side Content */}
    <div className="w-full md:w-1/2 text-center md:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        Verify your <span className="text-red-500">Pro</span>
      </h1>
      <p className="text-gray-700 mb-6 text-base sm:text-lg">
        Search and view the validity of any Pro.<br />
        Always verify your contractor before beginning any work.
      </p>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">

          {/* Company Name Input */}
          <div className="flex flex-col w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter Company Name"
              className="border border-gray-300 px-4 sm:px-6 py-3 rounded-md w-full sm:w-80 shadow text-gray-900 text-base"
              {...register("companyname", { required: "Please enter company name" })}
            />
            {errors.companyname && (
              <p className="text-red-500 text-sm mt-1">{errors.companyname.message}</p>
            )}
          </div>

          {/* Zip Code Input */}
          <div className="flex flex-col w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter Zip Code"
              className="border border-gray-300 px-4 sm:px-6 py-3 rounded-md w-full sm:w-40 shadow text-gray-900 text-base"
              {...register("zipcode", { required: "Please enter zip code" })}
            />
            {errors.zipcode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>
            )}
          </div>

          {/* Verify Button */}
          <button className="bg-red-500 text-white px-6 sm:px-8 py-3 rounded-md font-semibold shadow w-full sm:w-auto">
            Verify
          </button>
        </div>
      </form>
    </div>

    {/* Right Side Illustration */}
    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
      <Image
        src="/images/bannerimage.png"
        alt="Illustration"
        width={650}
        height={400}
        className="max-w-full h-auto"
      />
    </div>
  </div>
</section>




    </>);
}
