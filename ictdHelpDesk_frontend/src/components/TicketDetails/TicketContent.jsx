import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { FilePen, HardDrive, MonitorCog, User, Users, UserStar, Wrench } from "lucide-react";
import TicketAssignedOfficers from "./TicketAssignedOfficers";
import TicketFindingsResolutions from "./TicketFindingsResolutions";
import RemarksComponents from "./RemarksComponents";
import { useEffect } from "react";

const TicketContent = ({ ticket, isLoading = true, getTicket}) => {

    const userRoleStyling = {
        SystemAdmin: {
            icon: UserStar
        },
        Admin: {
            icon: MonitorCog
        },
        Manager: {
            icon: Users
        },
        Officer: {
            icon: Wrench
        },
        User: {
            icon: User
        }
    }

    const StatusStyling = userRoleStyling[ticket.requester?.accountRole?.replace(/\s+/g, '')]?.icon || userRoleStyling["User"]?.icon
    return(
        <>
            <div className="w-full py-6 flex flex-col gap-10 px-4 lg:px-0">
                <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-5 2xl:gap-10">
                    {
                        isLoading ? <>
                            <div className="flex flex-row gap-2">
                                <Skeleton className="size-12" />
                                <div>
                                    <p className="text-sm text-slate-500 mb-2 font-medium">Service Requester:</p>
                                    <Skeleton className="w-70 h-5 mb-2" />
                                    <Skeleton className="w-50 h-4" />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <Skeleton className="size-12" />
                                <div>
                                    <p className="text-sm text-slate-500 mb-2 font-medium">Ticket Created at:</p>
                                    <Skeleton className="w-70 h-5 mb-2" />
                                    <Skeleton className="w-50 h-4" />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <Skeleton className="size-12" />
                                <div>
                                    <p className="text-sm text-slate-500 mb-2 font-medium">Asset Number:</p>
                                    <Skeleton className="w-125 h-5 mb-2" />
                                    <Skeleton className="w-50 h-4" />
                                </div>
                            </div>
                        </> : 
                        <>
                            <div>
                                <p className="text-sm text-slate-500 mb-2 font-medium">Service Requester:</p>
                                <div className="flex flex-row gap-2">
                                    <div className={`w-12 h-12 rounded-md flex items-center justify-center border border-slate-500 bg-slate-100`}>
                                        <StatusStyling/>
                                    </div>  
                                    <div>
                                        <h1 className="font-bold text-xl">{ticket.requester?.name}</h1>
                                        <p className="text-xs text-slate-500">{ticket.requester?.office_department_division?.name}</p>                                   
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-2 font-medium">Ticket Created at:</p>
                                <div className="flex flex-row gap-2">
                                    <div className={`w-12 h-12 rounded-md flex items-center justify-center border border-slate-500 bg-slate-100`}>
                                        <FilePen />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-xl">{ticket.created_at ? format(new Date(ticket.created_at), "MMM dd yyyy, hh:mma") : "N/A"}</h1>    
                                        <p className="text-xs text-slate-500">{ticket.created_at ? formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true }) : "N/A"}</p>                    
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-2 font-medium">Asset Number:</p>
                                <div className="flex flex-row items-center gap-4 w-full">
                                    <div className={`w-12 h-12 rounded-md flex items-center justify-center border border-slate-500 bg-slate-100`}>
                                        <HardDrive />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-xl">#{ticket.assetNumber ? ticket.assetNumber : "N/A"}</h1>    
                                        <p className="text-xs text-slate-400">Present Number or serial number  on the device being serviced</p>
                                    </div>
                                </div>
                                <div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <TicketAssignedOfficers assignedOfficers={ticket.assignment} isLoading={isLoading} ticket={ticket} getTicket={getTicket}/>
                {
                    ticket.resolution !== "N/A" && ticket.findings !== "N/A" &&             
                    <TicketFindingsResolutions ticket={ticket} isLoading={isLoading}/>
                }
                {
                    isLoading ?
                    <Skeleton className=" h-50 rounded-md mr-6 hidden md:flex" /> 
                    : 
                    <RemarksComponents ticket={ticket} />
                }
            </div>
        </>
    ); 
}

export default TicketContent;
