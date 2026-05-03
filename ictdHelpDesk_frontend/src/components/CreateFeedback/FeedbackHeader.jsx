import { Button } from "@/components/ui/button"
import { ArrowLeft, CircleChevronDown, CircleEqualIcon, Flame, MessageCircle, OctagonAlert } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "../ui/skeleton"


const FeedbackHeader = ({ticket}) => {
    const nav = useNavigate()
    
    const Criticality = {
        Critical: {
            icon: <Flame strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <Flame strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500"
        },
        High: {
            icon: <OctagonAlert strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <OctagonAlert strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500"
        },
        Medium: {
            icon: <CircleEqualIcon strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <CircleEqualIcon strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500"
        },
        Low: {
            icon: <CircleChevronDown strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <CircleChevronDown strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500"

        }
    };
    return (
        <div className="w-full flex flex-row px-4 justify-between">
            <div className="flex flex-row gap-2">
                <Button size="icon" variant="outline" onClick={()=> nav(-1)} disabled={!ticket.id}>
                    <ArrowLeft/>
                </Button>
                {
                    ticket.id ? 
                    <div className="flex flex-row gap-2 item-center">
                        {
                            <div className={`w-12 aspect-square rounded-md ${Criticality[ticket.priority?.name]?.bg} ${Criticality[ticket.priority?.name]?.color} items-center justify-center flex border ${Criticality[ticket.priority?.name]?.border}`}>
                                {
                                    Criticality[ticket.priority?.name]?.bigIcon
                                }
                            </div>
                        }
                        <div>
                            <div className="flex flex-row items-center gap-1">
                                <p className="font-bold text-2xl">{ticket.activitySpecification?.name}</p>
                                <p className="text-sm text-slate-500">- {ticket.activity.name}</p>
                            </div>
                            <p className="text-xs text-slate-500"> # ACT-003-ISS-DMS-01-OAICTD-0000000-20260309-XJWV</p>
                        </div>
                    </div> :
                    <div className="flex flex-row gap-2 item-center">
                        <Skeleton className="w-12 h-12"/>
                        <div>
                            <div className="flex flex-row items-center gap-1">
                                <Skeleton className="w-md h-7"/>
                            </div>
                            <Skeleton className="w-xs h-4 mt-1"/>
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-row gap-2 item-center">
                <div className="flex flex-col justify-center items-end">
                    <p className="text-base font-bold">Service</p>
                    <p className="text-xs text-slate-500">Feedback & Suggestions</p>
                </div>
                <div className="w-12 aspect-square rounded-md bg-slate-500/10 items-center justify-center flex">
                    <MessageCircle/>
                </div>
            </div>
        </div>
    )
}

export default FeedbackHeader
