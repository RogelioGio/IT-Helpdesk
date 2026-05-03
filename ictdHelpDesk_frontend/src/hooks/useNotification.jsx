import { Button } from "@/components/ui/button";
import { echoInstance } from "@/echo";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useTicketStore } from "@/stores/useTicketStore";
import { set } from "date-fns";
import { AlertCircle, Bell, ChartNoAxesCombinedIcon, CircleChevronDown, CircleDot, CircleEqual, CircleMinus, ClipboardCheck, ClipboardList, Flame, MessageCircleQuestionIcon, MessageSquare, OctagonAlert, Ticket, UserCheck, UserCog, UserPlus, UserStar, UserX, UserXIcon, Wrench, X } from "lucide-react";
import { useEffect, useRef } from "react"
import { toast } from "sonner";
import {toast as sonnerToast} from "sonner";

const notificationIcons = {
    NewCreatedTicket: Ticket,
    "Yourticket'sprioritylevelhasbeenupdated": ChartNoAxesCombinedIcon,
    StatusUpdated: ClipboardList,
    NewTicketAssignment: Ticket,
    Default: AlertCircle,
    RequestAssignment: UserPlus,
    RequestAssignmentRejected : UserXIcon,
    RequestAssignmentApproved: UserPlus,
    Tickethasbeencancelled: CircleMinus,
    NewRemark: MessageSquare
};


export const useNotification = ({user, account_role}) => {
    const {addTicket, updateTicket, setTicket, addNewRemark, addRecentTicket} = useTicketStore();
    const {appendNotifications, fetchNotifications, reset} = useNotificationStore();
    const isSubscribed = useRef(false);

    useEffect(()=> {
        if(!user || !user.id || isSubscribed.current) return;

        isSubscribed.current = true;
        reset();
        fetchNotifications();


        const channelName = `App.Models.User.${user.id}`;

        echoInstance.private(channelName).notification((notification) => { 
            
            if(notification.toastHeader === "New Created Ticket") {
                if(account_role == "Manager"){
                    return;
                }
                addTicket(notification.context); // use for the ticketmanagements
            } if(notification.toastHeader === "New Remark Added" ){
                addNewRemark(notification.context); // use for the notification for the remarks
            }
            else {
                updateTicket(notification.context) // use in the list
                setTicket(notification.context) // use in the details page if the updated ticket is currently opened
            }
            
            Notification({
                model: notification.model,
                action: notification.action,
                title: notification.toastHeader,
                description: notification.toastDescription,
            })
        //    appendNotifications(notification); // use for the notification dropdown

        })
        .listen('.notification.created', (data) => {
            appendNotifications(data);
            //console.log("Received notification.created event with data:", data);
        });

        //Actors Brodcasting event channels
        //Reserve brodcast fot the users and officers since they are primarly the actors

        const roleChannel = `realtime-channel-${account_role}-${user.id}`;
        const realtimeEvents = echoInstance.private(roleChannel);

        realtimeEvents
        .listen('.ticket.cancelled', (data) => {
            updateTicket(data.ticket);
        })
        .listen('.ticket.responded', (data) => {
            updateTicket(data.ticket);
        })
        .listen('.ticket.resolved', (data) => {
            updateTicket(data.ticket);
        })
        .listen('.ticket.closed', (data) => {
            updateTicket(data.ticket);
        })
        .listen('.assignment.removed', (data) => {
            setTicket(data.ticket);
        })
        .listen('.user.ticket.created', (data) => {
            console.log("Received user.ticket.created event with data:", data);
            addRecentTicket(data.ticket);
        })




        return () => {
            echoInstance.leave(roleChannel)
            echoInstance.leave(`App.Models.User.${user.id}`);
            isSubscribed.current = false;
        }
    }, [user])
}

export function Notification(toast){
   return sonnerToast.custom((id) => (
        <NotifcationToast 
            id={id}
            title={toast.title}
            description={toast.description}
            model={toast.model}
            action={toast.action}
        />
    ))
} 



function NotifcationToast(props){
    const {id, title, description, model, action} = props;

    const iconMapping = {
        Ticket: {
            created: MessageCircleQuestionIcon,
            criticality_critical: Flame,
            criticality_high: OctagonAlert,
            criticality_medium: CircleEqual,
            criticality_low: CircleChevronDown,
            assignment: UserPlus,
            assigned: UserCog,
            assignment_updated: UserCog,
            assignment_request: UserStar,
            assignment_request_approved: UserCheck,
            assignment_request_rejected: UserXIcon,
            unassigned: UserX,
            responded: Wrench,
            resolved: ClipboardCheck,
            closed: CircleDot,
            cancelled: CircleMinus,
            remark_added: MessageSquare 
        }
    }
    const colorMapping = {
        Ticket: {
            created: {
                background: "bg-blue-700/10",
                text: "text-blue-700",
                border: "border-blue-700"
            },
            criticality_critical: {
                background: "bg-red-600/10",
                text: "text-red-600",
                border: "border-red-600"
            },
            criticality_high: {
                background: "bg-orange-600/10",
                text: "text-orange-600",
                border: "border-orange-600"
            },
            criticality_medium: {
                background: "bg-yellow-600/10",
                text: "text-yellow-600",
                border: "border-yellow-600"
            },
            criticality_low: {
                background: "bg-blue-600/10",
                text: "text-blue-600",
                border: "border-blue-600"
            },
            assigned: {
                background: "bg-purple-700/10",
                text: "text-purple-700",
                border: "border-purple-700"
            },
            assignment: {
                background: "bg-purple-700/10",
                text: "text-purple-700",
                border: "border-purple-700"
            },
            assignment_updated: {
                background: "bg-blue-700/10",
                text: "text-blue-700",
                border: "border-blue-700"
            },
            assignment_request: {
                background: "bg-amber-400/10",
                text: "text-amber-400",
                border: "border-amber-400"
            },
            assignment_request_approved: {
                background: "bg-green-700/10",
                text: "text-green-700",
                border: "border-green-700"
            },
            assignment_request_rejected: {
                background: "bg-red-700/10",
                text: "text-red-700",
                border: "border-red-700"
            },
            unassigned: {
                background: "bg-gray-600/10",
                text: "text-gray-600",
                border: "border-gray-600"
            },
            responded: {
                background: "bg-yellow-700/10",
                text: "text-yellow-700",
                border: "border-yellow-700"
            },
            resolved: {
                background: "bg-emerald-700/10",
                text: "text-emerald-700",
                border: "border-emerald-700"
            },
            closed: {
                background: "bg-zinc-950/10",
                text: "text-zinc-950",
                border: "border-zinc-950"
            },
            cancelled: {
                background: "bg-slate-600/10",
                text: "text-slate-600",
                border: "border-slate-600"
            },
            remark_added:{
                background: "bg-blue-600/10",
                text: "text-blue-600",
                border: "border-blue-600"
            }
            
        }
    }

    const IconSelected = iconMapping[model][action] || Bell;
    const style = colorMapping[model][action] || {
        background: "bg-gray-600/10",
        text: "text-gray-600",
        border: "border-gray-600"
    }

    return (
        <div className="w-full md:max-w-250 p-4 shrink-0 bg-white rounded-md shadow-md border border-gray-200 flex flex-row gap-2 font-google items-start">
            <div className={`${style.background} ${style.text} ${style.border} flex items-center justify-center rounded-md size-12 shrink-0`}>
                <IconSelected size={20} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <p className="font-bold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground ">{description}</p>
            </div>
        </div>
    )
}



// const notificationData = {
//     "model": "Ticket",
//     "action": "cancelled",
//     "toastHeader": "New Ticket Assigned: #12345",
//     "toastDescription": "your ticket #12345 has been marked as critical. ",
// }

// const handleTryNotification = () => {
//     // toast.success(notificationData.toastDescription)
//     notification({
//         model: notificationData.model,
//         action: notificationData.action,
//         title: notificationData.toastHeader,
//         description: notificationData.toastDescription,
//     })
// }   