import Link from "next/link";
import { ProjectDet } from "../../../../components/Areas/ProjectsManagement/ProjectDetails";



export default function Page({params}){


 const { id } = params;



    return(<>
    
<div className="flex flex-col sm:flex-row items-start sm:items-center mt-6 sm:mt-10 px-4 sm:px-5 justify-between gap-3 sm:gap-0 mb-5">
  {/* Breadcrumb */}
  <nav className="flex overflow-x-auto" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 sm:space-x-2 md:space-x-3 rtl:space-x-reverse text-sm sm:text-base">
      <li className="inline-flex items-center flex-shrink-0 whitespace-nowrap">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          Dashboard
        </Link>
      </li>

      <li className="flex-shrink-0 whitespace-nowrap">
        <div className="flex items-center">
          <svg
            className="rtl:rotate-180 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-1 sm:mx-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <Link
            href="/admin/projects"
            className="ms-1 sm:ms-2 text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Projects
          </Link>
        </div>
      </li>

      <li className="flex-shrink-0 whitespace-nowrap">
        <div className="flex items-center">
          <svg
            className="rtl:rotate-180 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-1 sm:mx-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <Link
            href="#"
            className="ms-1 sm:ms-2 text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Project Details
          </Link>
        </div>
      </li>
    </ol>
  </nav>

  {/* Back Button */}
  <Link
    href="/admin/projects"
    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm flex items-center self-start sm:self-auto mt-2 sm:mt-0"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 inline-block mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    Back
  </Link>
</div>



        <ProjectDet projectid = {id} />


    
    </>);
}