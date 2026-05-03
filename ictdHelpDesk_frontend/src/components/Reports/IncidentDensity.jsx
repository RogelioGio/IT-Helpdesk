import { useEffect, useState } from "react";
import ContentTableAndReport from "./IncidentDensity/ContentTableAndReport";
import HeaderCard from "./IncidentDensity/HeaderCard";
import axiosClient from "@/AxiosClient";
import { Skeleton } from "../ui/skeleton";
import { useReportStore } from "@/stores/useReportStore";

const IncidentDensity = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const {params} = useReportStore();

    useEffect(() => {
        setLoading(true);
        axiosClient.post('api/incident-density', params)
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
                </> :
                <>
                    <HeaderCard data={data}/>
                    <ContentTableAndReport data={data}/>
                </>
            }
        </div>
    );
};

export default IncidentDensity;
