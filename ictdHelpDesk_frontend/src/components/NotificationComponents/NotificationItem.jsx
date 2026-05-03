import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { AlertCircle, Bell, ChartNoAxesCombinedIcon, CircleChevronDown, CircleDot, CircleEqual, CircleMinus, ClipboardCheck, ClipboardList, Flame, MessageCircleQuestionIcon, MessageSquare, OctagonAlert, Ticket, UserCheck, UserCog, UserPlus, UserStar, UserX, UserXIcon, Wrench, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationItem = (notification) => {
    const { context, created_at, read_at } = notification;
    const nav = useNavigate();

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

    const IconSelected = iconMapping[context.model][context.action] || Bell;
    const style = read_at === null ? colorMapping[context.model][context.action] : {
        background: "bg-gray-600/10",
        text: "text-gray-600",
        border: "border-gray-600"
    }

    const navigation = {
        Ticket: `ticket/${context?.navigation_id}/details`,
    }
    const routeToNavigate = navigation[context.model] || '/';

    return (
        <div className="flex flex-row gap-4 border-b p-4 hover:cursor-pointer hover:bg-accent" onClick={() => {
            if(context.navigation_id){
                nav(routeToNavigate);
            }}}>
            <div className={`${style.background} ${style.text} ${style.border} rounded-lg size-12 items-center justify-center flex shrink-0`}>
                <IconSelected  className="size-6"/>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center justify-between">
                    <p className="font-medium text-sm">{context.title}</p>
                    <p className="text-xs text-slate-500">{differenceInDays(new Date(created_at), new Date()) > 0 ? format(new Date(created_at), "MMM dd, yyyy") : formatDistanceToNow(new Date(created_at), { includeSeconds: true, addSuffix: true })}</p>
                </div>
                <p className="text-xs text-slate-500 font-google">{context.message || context.description}</p>
            </div>
        </div>
    )
}
export default NotificationItem;