'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuardPro({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) 
      {
        router.push('/sign-in');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/protected-check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) 
        { 
          const data = await res.json();
          console.log("Protected check response:", data);

          if(data.status == 401){
            router.push('/admin-login');
          }
          else if(data.user.role == "Admin"){
             router.push('/admin/dashboard');
          }

        } 
   
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/admin-login');
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();



  }, [router]);





  if (isLoading) return <div>Checking login...</div>;




  return <>{children}</>;




  
}
