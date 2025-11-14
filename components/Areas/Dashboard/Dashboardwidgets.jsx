import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";







export function Dashboardwidgets() {

           
            const router = useRouter();
            const [stats,Setstats] = useState([]);

             const fetchStats = async () => {

                const res  = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/widgets-count`);
                    if(res.ok){
                        const result = await res.json();
                        if(result.status == 200){
                            Setstats(result.data);
                        }
                    }
             }   

             useEffect(() => {
                 fetchStats();
             }, []);




             const redirect =(data)=>{
                router.push(data);
             }







    return (<>









        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 cursor-pointer">
            {stats.map(({ title, value, change ,url }) => (
                <div key={title} className="bg-white rounded-xl shadow-sm border p-5" onClick={()=> redirect(url)}>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-800">{value}</p>
                        <p className="text-green-600 text-sm flex items-center font-medium">
                           
                            {change}
                        </p>
                    </div>
                </div>
            ))}
        </div>



    </>);
}