import axiosClient from "@/AxiosClient"
import SidebarTicketAsignee from "@/components/TicketDetails/TicketTimeline"
import TicketDescriptionFindingResolution from "@/components/TicketDetails/TicketContent"
import TicketSpecificDetails from "@/components/TicketDetails/TicketSpecificDetails"
import ViewHeader from "@/components/TicketDetails/ViewHeader"
import DeleteTicket from "@/components/TicketManagement/DeleteTicket"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, formatDistanceToNow, formatDistanceToNowStrict, set } from "date-fns"
import { ArrowLeft, CircleDot, File, MessageCircle, MessageCircleQuestion, Notebook, User, UserCog, Wrench } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { array } from "yup"
import TicketTimeline from "@/components/TicketDetails/TicketTimeline"
import { Badge } from "@/components/ui/badge"
import AssignTicket from "@/components/TicketDetails/AssignTicket"
import ResolveTicket from "@/components/TicketDetails/ResolveTicket"
import TicketContent from "@/components/TicketDetails/TicketContent"
import TicketAssignedOfficers from "@/components/TicketDetails/TicketAssignedOfficers"
import TicketSidebarContent from "@/components/TicketDetails/TicketSidebarContent"
import { useAuth } from "@/contexts/AuthProvider"
import { useTicketStore } from "@/stores/useTicketStore"


export default function TicketDetailsPage() {
    const { ticket, setTicket } = useTicketStore();
    const {ticketId} = useParams()
    // const [ticket, setTicket] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [openAssign, setOpenAssign] = useState(false)
    const [openDelete, setOpenDelete] = useState(false);
    const [openResolve, setOpenResolve] = useState(false)
    const {isMobile} = useSidebar();
    const {accountRole} = useAuth();

     const statusStyling = {
        Open: {
            color: "text-blue-700",
            bg:"bg-blue-700/10",
            icon: <MessageCircleQuestion strokeWidth={2} className="w-4 h-4 text-blue-700" data-icon="inline-end"/>
        },
        Assigned: {
            color: "text-purple-700",
            bg: "bg-purple-700/10",
            icon: <UserCog strokeWidth={2} className="w-4 h-4 text-purple-700" data-icon="inline-end"/>
        },
        Responded: {
            color: "text-emerald-700",
            bg: "bg-emerald-700/10",
            icon: <Wrench strokeWidth={2} className="w-4 h-4 text-emerald-700" data-icon="inline-end"/>
        },
        Resolved: {
            color: "text-emerald-700",
            bg: "bg-emerald-700/10",
            icon: <CircleDot strokeWidth={2} className="w-4 h-4 text-emerald-700" data-icon="inline-end"/>
        },
        Closed: {
            color: "text-slate-700",
            bg: "bg-slate-700/10",
            icon: <CircleDot strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
        },
        Cancelled: {
            color: "text-red-700",
            bg: "bg-red-700/10",
            icon: <CircleDot strokeWidth={2} className="w-4 h-4 text-red-700" data-icon="inline-end"/>
        }
    };

    const getTicket = (ticketId) => {
        setIsLoading(true);
        if(ticketId === "null") return
        axiosClient.get(`api/tickets/${ticketId}`)
        .then(({data}) => {
            setTicket(data.data)
            setIsLoading(false)
        })
        .catch((error) => {
            console.error('Error fetching ticket:', error);
            toast.error("Failed to fetch ticket details. Please try again later.")
        })}

    const updateTicketCriticalLevel = useCallback((ticket, criticalLevel) => {
           const snapshot = ticket
           const updatedTicket = {...ticket, priority: {...ticket.priority, id: Number(criticalLevel) }}
           setTicket(updatedTicket);
        axiosClient.patch(`api/tickets/${ticket.id}/priority`, { priority_id: criticalLevel })
            .catch(error => {
                setTicket(prev => ({...prev, priority: {id: prev.priority.id}}));
                console.error('Error. Rolling back to snapshot...', error);
                toast.error("Failed to update critical level. Please try again.");
            });
    }, [])

    useEffect(() => {
        getTicket(ticketId);
    },[ticketId])

//     useEffect(() => {
//         const handleTicketUpdate = (event) => {
//             console.log("Received ticket update notification:", event.detail);
//             const updatedTicket = event.detail;
//             setTicket(updatedTicket);
//         };
//         window.addEventListener("updated-priority-notification", handleTicketUpdate);
//         window.addEventListener("status-updated-notification", handleTicketUpdate);
//         window.addEventListener("new-assignment-notification", handleTicketUpdate);
//         window.addEventListener("request-assignment-notification", handleTicketUpdate);
//         window.addEventListener("request-assignment-rejected-notification", handleTicketUpdate);
//         window.addEventListener("assignment-removed-notification", handleTicketUpdate);
//         window.addEventListener("request-assignment-approved-notification", handleTicketUpdate);
//         window.addEventListener("ticket-cancelled-notification", handleTicketUpdate);

//         return () => {
//             window.removeEventListener("updated-priority-notification", handleTicketUpdate);
//             window.removeEventListener("status-updated-notification", handleTicketUpdate);
//             window.removeEventListener("new-assignment-notification", handleTicketUpdate);
//             window.removeEventListener("request-assignment-notification", handleTicketUpdate);
//             window.removeEventListener("request-assignment-rejected-notification", handleTicketUpdate);
//             window.removeEventListener("assignment-removed-notification", handleTicketUpdate);
//             window.removeEventListener("request-assignment-approved-notification", handleTicketUpdate);
//             window.removeEventListener("ticket-cancelled-notification", handleTicketUpdate);
//         };
// },[])

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden">
                <div className="flex flex-col pt-4 md:pt-6 flex-1">
                    <ViewHeader 
                                id={ticket.id}
                                updateCriticality={updateTicketCriticalLevel}
                                isLoading={isLoading}
                                ticket={ticket}
                                getTicket={getTicket}
                                openResolve={setOpenResolve}
                                /> 
                        <Tabs defaultValue="details" className="w-full gap-0 flex-1">
                                {isMobile ?  
                                    <TabsList className="px-4" variant="line">
                                    <TabsTrigger value="details">
                                        <File />
                                        Details
                                    </TabsTrigger>
                                    <TabsTrigger value="officers">
                                        <UserCog />
                                        Assigned Officers
                                        <Badge variant="secondary">
                                            {ticket.assignment?.length || 0}    
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="feedback">
                                        <MessageCircle />
                                        Feedback
                                    </TabsTrigger>
                                    <TabsTrigger value="activity">
                                        <Notebook />
                                        Remarks
                                    </TabsTrigger>
                                </TabsList> : null
                                }
                                <Separator />
                                <TabsContent value="details" className="">
                                    <div className={`h-full grid grid-cols-1 ${accountRole=== "Officer" || accountRole === "User" ? "lg:grid-cols-[1fr_350px]" : "lg:grid-cols-[1fr_400px]"} grid-rows-[min-content_min-content] gap-y-5 ${accountRole === "Officer" || accountRole === "User" ? "mx-6" : " mx-12"} lg:grid-rows-[1fr]`}>
                                        <TicketContent ticket={ticket} isLoading={isLoading} getTicket={getTicket}/>
                                        <TicketSidebarContent ticket={ticket} isLoading={isLoading}/>
                                    </div>
                                </TabsContent>
                                <TabsContent value="feedback" className="">
                                </TabsContent>
                                <TabsContent value="officers" className="">
                                    <AssignTicket ticket={ticket} assignedOfficer={ticket.assignment} getTicket={getTicket}/>
                                </TabsContent>
                            </Tabs>   
                </div>
            </div>
            <DeleteTicket open={openDelete} setOpen={setOpenDelete} ticket={ticket} />
            <ResolveTicket open={openResolve} setOpen={setOpenResolve} ticket={ticket} getTicket={getTicket}/>
        </div>
    )
}