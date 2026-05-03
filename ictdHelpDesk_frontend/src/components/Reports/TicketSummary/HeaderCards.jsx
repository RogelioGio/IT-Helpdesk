import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { title } from "@uiw/react-md-editor";
import { ChartBar, CircleDot, CircleMinus, ClipboardCheckIcon, MessageCircleQuestion, Ticket, UserCog, Wrench } from "lucide-react";
import { use } from "react";

const ticketDataStyling = {
    open: {
        title: "Open Tickets",
        icon: MessageCircleQuestion,
        shortDesc: "are currently open and awaiting action.",
        color: "text-blue-700",
        bg:"bg-blue-700/10",
    },
    assigned: {
        title: "Assigned Tickets",
        icon: UserCog,
        shortDesc: "have been assigned to an officer.",
        color: "text-purple-700",
        bg:"bg-purple-700/10",
    },
    responded:{
        title: "Responded Tickets",
        bg:"bg-yellow-700/10",
        color: "text-yellow-700",
        shortDesc: "have received a response from an officer.",
        icon: Wrench,
    },
    resolved: {
        title: "Resolved Tickets",
        icon: ClipboardCheckIcon,
        shortDesc: "have been resolved.",
        color: "text-green-700",
        bg:"bg-green-700/10",
    },
    closed: {
        title: "Closed Tickets",
        icon: CircleDot,
        shortDesc: "have been closed.",
        color: "text-zinc-700",
        bg:"bg-zinc-700/10",
    },
    cancelled: {
        title: "Cancelled Tickets",
        icon: CircleMinus,
        shortDesc: "have been cancelled.",
        color: "text-slate-700",
        bg:"bg-slate-700/10",
    },
}

const HeaderCards = ({data}) => {
    const {ticketVolumeBreakdown} = data;
    return (
        <>
            <div className="w-fulll border rounded-md">
                <div className="p-4 bg-accent/10 border-b">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                            <ChartBar />
                        </div>
                        <div>
                            <p className="font-bold">Ticket Volume Breakdown</p>
                            <p className="text-xs text-slate-500">Overall Total ticket breakdown with their current statuses</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-6">
                    {
                        Object.keys(ticketDataStyling).map((key) => {
                            const item = ticketDataStyling[key];
                            const Icon = item.icon;

                            const count = ticketVolumeBreakdown?.[key] ?? 0;
                            return (
                                <div className="border-r p-4 last:border-r-0 flex flex-col gap-2" key={key}>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-sm ">{item.title}</p>
                                        <Icon className={`size-4 text-slate-500`}/>
                                    </div>
                                    <p className="font-bold text-2xl">{count} {count > 1 ? "tickets" : "ticket"}</p>
                                    <p className={`text-xs text-slate-500`}>{item.shortDesc}</p>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </>
    );
}

export default HeaderCards;