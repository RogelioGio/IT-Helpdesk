import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { useEffect, useState } from "react";
import axiosClient from "@/AxiosClient";
import { set } from "date-fns";

export default function Dashboard() {
    const [dashboardHeaderData, setDashboardHeaderData] = useState({});
    const fetchDashboardData = () => {
        axiosClient.get('api/dashboard/initialize')
            .then(({data}) => {
                setDashboardHeaderData(data.data);
            })
            .catch((error) => {
                setDashboardHeaderData({});
            })
    }
    
    useEffect(() => {
        fetchDashboardData();
    }, []);
            
    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 flex-1">
                        <DashboardHeader data={dashboardHeaderData} />
                        <DashboardContent/>
                    </div>
                </div>
            </div>
        </>
    )
}