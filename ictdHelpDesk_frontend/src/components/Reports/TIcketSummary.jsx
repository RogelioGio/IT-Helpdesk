
import axiosClient from "@/AxiosClient";
import ContentTablesAndReports from "./TicketSummary/ContentTablesAndReports";
import HeaderCards from "./TicketSummary/HeaderCards";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { se } from "date-fns/locale";
import { useReportStore } from "@/stores/useReportStore";

const TicketSummary = () => {
    const {params} = useReportStore();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    useEffect(() => {
        setLoading(true);
        axiosClient.post('api/ticket-summary',params)
            .then(({data}) => {
                setLoading(false)
                setData(data.data);
            })
            .catch(() => setLoading(false));
    },[params])

    return (
        <div className="flex flex-col gap-4 h-full min-h-0 max-h-full flex-1">
            {
                loading ? 
                <>
                    <Skeleton className="h-55 w-full rounded-md"/>
                    <Skeleton className="flex-1 w-full rounded-md"/>
                </>
                :
                <>
                    <HeaderCards data={data}/>
                    <div className="flex-1 min-h-0 flex flex-col">
                        <ContentTablesAndReports data={data}/>
                    </div> 
                </>
            }
        </div>
    );
}

export default TicketSummary;