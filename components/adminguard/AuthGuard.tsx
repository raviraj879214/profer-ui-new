'use client';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../Frontend/shared/Header';
import { Footer } from '../Frontend/shared/Footer';
import {BouncingLoader} from "../../components/reusable/BouncingLoader";
interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/admin-login');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/protected-check`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Protected check response:", data);
          if (data.status == 401) {
            router.push('/admin-login');
            return;
          } else if (data.user.role == "Pro") {
            router.push('/pro/step-1');
            return;
          }
        } else {
          router.push('/admin-login');
          return;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/admin-login');
        return;
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, [router]);

  if (isLoading) {
    return (
      // <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      //   {/* Spinner */}
      //   <div role="status" className="mb-4">
      //     <svg
      //       aria-hidden="true"
      //       className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-700 fill-blue-600"
      //       viewBox="0 0 100 101"
      //     >
      //       <path
      //         d="M100 50.59C100 78.2 77.6 100.59 50 100.59C22.38 100.59 0 78.2 0 50.59C0 22.97 22.38 0.59 50 0.59C77.6 0.59 100 22.97 100 50.59Z"
      //         fill="currentColor"
      //       />
      //       <path
      //         d="M93.97 39.04C96.39 38.4 97.86 35.91 97.00 33.55C95.29 28.82 92.87 24.37 89.81 20.34C85.84 15.11 80.88 10.72 75.21 7.41C69.54 4.10 63.27 1.94 56.76 1.05C51.76 0.36 46.69 0.44 41.73 1.27C39.26 1.69 37.81 4.19 38.45 6.62C39.08 9.04 41.56 10.47 44.05 10.10C47.85 9.54 51.71 9.52 55.54 10.04C60.86 10.77 65.99 12.54 70.63 15.25C75.27 17.96 79.33 21.56 82.58 25.84C84.91 28.91 86.79 32.29 88.18 35.87C89.08 38.21 91.54 39.67 93.97 39.04Z"
      //         fill="currentFill"
      //       />
      //     </svg>
      //   </div>
      //   <p className="text-gray-600 dark:text-gray-400 text-lg">Please wait while we verify your session...</p>
      // </div>

         <div className="flex justify-center items-center  bg-gray-800" style={{width : "100%" }}>
            <BouncingLoader />
          </div>
      
    );
  }

  return <>
   
      {children} 
  
  </>;




}
