import { useEffect, useState } from "react";







export function Dashboardwidgets() {

            const statsdd = [
                { title: 'Companies Pending Verification', value: 27, change: '+12%' },
                { title: 'Active Projects', value: 124, change: '+8%' },
                { title: 'Completed Projects', value: 368, change: '+15%' },
            
            ];

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












    return (<>









        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ title, value, change }) => (
                <div key={title} className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="text-gray-500 text-sm">{title}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-800">{value}</p>
                        <p className="text-green-600 text-sm flex items-center font-medium">
                            {/* <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg> */}
                            {change}
                        </p>
                    </div>
                </div>
            ))}
        </div>

    </>);
}