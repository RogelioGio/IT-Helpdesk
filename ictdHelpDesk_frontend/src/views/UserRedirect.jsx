import axiosClient from "@/AxiosClient";
import { Clipboard, Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRedirect() {
    const nav = useNavigate();

    //  useEffect(() => {
    //         axiosClient.get('/api/tickets')
    //             .then(({data}) => {
    //                 const firstTicketId = data.data[0]?.ticketId;
    //                 nav(`${firstTicketId}/details`);
    //             })
    //             .catch(error => {
    //                 toast.error("Failed to fetch active tickets.");
    //             });
    //     }, [nav]);

    return (
        <div className="flex flex-col items-center gap-2 text-center w-full justify-center flex-1">
            <div className="flex flex-col justify-between items-center gap-5">
                    <Clipboard className="h-16 w-16 text-gray-700"/>
                <div>
                    <p className="text-lg font-medium">Select a Ticket to View Details</p>
                    <p className="text-sm text-slate-500">Review ticket information by selecting an item from the sidebar.</p>
                </div>
            </div>
        </div>
    )
}