import { FileBadge, Handshake, MessageCircleHeart, MousePointerClick, PieChartIcon, Shield, UserCog } from "lucide-react";

const ContentBreakDown = ({ data }) => {
    const {FeedbackSatisfactionBreakDown} = data;
    return (
        <div className="w-fulll border rounded-md flex flex-col overflow-hidden">
            <div className="p-4 bg-accent/10 border-b">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center ">
                        <PieChartIcon />
                    </div>
                    <div>
                        <p className="font-bold">Feedback Dimension Breakdown</p>
                        <p className="text-xs text-slate-500">Breakdown of feedback rating received across different dimensions</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-6">
                {DimensionStyling.map((dimension, index) => (
                    <div key={index} className="flex flex-col p-4 last:border-r-0 border-r gap-1">
                        <div className="flex flex-row justify-between items-center gap-2">
                            <p className="text-sm">{dimension.label}</p>
                            <dimension.icon className="size-4 text-slate-500"/>
                        </div>
                        <div>
                            <p className="font-bold text-2xl">{FeedbackSatisfactionBreakDown[index]?.rating || 0} <span className="font-normal text-sm text-slate-500">/ 5.0</span></p>
                            <p className="text-xs text-slate-500">Average Rating</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContentBreakDown;

const DimensionStyling = [
    {
        label: "Responsiveness",
        icon: UserCog
    },
    {
        label: "Reliability",
        icon: MousePointerClick
    },
    {
        label: "Communication",
        icon: MessageCircleHeart
    },
    {
        label: "Integrity",
        icon: Shield
    },
    {
        label: "Assurance",
        icon: Handshake
    },
    {
        label: "Outcome",
        icon: FileBadge
    }
]