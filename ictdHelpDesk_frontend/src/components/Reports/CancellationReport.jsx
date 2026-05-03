import { useEffect, useState } from "react";
import Content from "./CancellationReport/Content";
import HeaderGraph from "./CancellationReport/HeaderGraph";
import axiosClient from "@/AxiosClient";
import { Skeleton } from "../ui/skeleton";
import { useReportStore } from "@/stores/useReportStore";

const CancellationReport = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const {params} = useReportStore();

    useEffect(() => {
        setLoading(true);
        axiosClient.post('api/cancellation-report', params)
            .then(({data}) => {
                setData(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    },[params])


    return (
        <div className="flex flex-col gap-4 h-full min-h-0 max-h-full flex-1">
            {
                loading ?
                <>
                    <Skeleton className="w-full h-100"/>
                    <div className="flex flex-row gap-4 flex-1">
                        <Skeleton className="flex-1 w-full"/>
                        <Skeleton className="flex-1 w-full"/>
                    </div>
                </>
                : <>
                    <HeaderGraph data={data}/>
                    <Content data={data}/>
                </>
            }
        </div>
    )
}

export default CancellationReport;