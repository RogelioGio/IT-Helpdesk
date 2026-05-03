import { ChartPie, ChartPieIcon, CircleDot, CircleMinus, ClipboardCheckIcon, MessageCircleQuestion, Ticket, UserCog, Wrench } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart } from "recharts";

const DashboardTicketBreakdownChart = () => {
    const chartData = [
        {status: "Open", count: 10, fill: "#1d4ed8", bg: "bg-blue-700/10", border: "border-blue-700", text: "text-blue-700"},
        {status: "Assigned", count: 5, fill: "#7e22ce", bg: "bg-purple-700/10", border: "border-purple-700", text: "text-purple-700"},
        {status: "Responded", count: 3, fill: "#a16207", bg: "bg-amber-700/10", border: "border-amber-700", text: "text-amber-700"},
        {status: "Resolved", count: 8, fill: "#047857", bg: "bg-emerald-700/10", border: "border-emerald-700", text: "text-emerald-700"},
        {status: "Closed", count: 10, fill: "#09090b", bg: "bg-slate-700/10", border: "border-slate-700", text: "text-slate-700"},
        {status: "Cancelled", count: 2, fill: "#334155", bg: "bg-zinc-700/10", border: "border-zinc-700", text: "text-zinc-700"},
    ]
    const iconMapping = {
        Open: MessageCircleQuestion,
        Assigned: UserCog,
        Responded: Wrench,
        Resolved: ClipboardCheckIcon,
        Closed: CircleDot,
        Cancelled: CircleMinus,
    }
    const chartConfig = {
        open: {
            label: "Open",
            color: "#1d4ed8",
            bg:"bg-blue-700/10",
            text: "text-blue-700",
            border: "border-blue-700",
        },
        assigned: {
            label: "Assigned",
            color: "#7e22ce",
            bg:"bg-purple-700/10",
            text: "text-purple-700",

            border: "border-purple-700",

        },
        responded:{
            label: "Responded",
            color: "#a16207",
            bg:"bg-amber-700/10",
            border: "border-amber-700",
            text: "text-amber-700",
        },
        resolved:{
            label: "Resolved",
            color: "#047857",
            bg:"bg-emerald-700/10",
            border: "border-emerald-700",
        },
        closed:{
            label: "Closed",
            color: "#09090b",
            bg:"bg-slate-700/10",
            border: "border-slate-700",
        },
        cancelled:{
            label: "Cancelled",
            color: "#334155",
            bg:"bg-slate-700/10",
            border: "border-slate-700",
        }
    }

    return (
        <div className="border border-slate-200 bg-slate-200/10 rounded-md h-full xl:h-100 overflow-hidden md:col-span-2 col-span-1 flex flex-col @container/ticketBreakdownChart">
            {/* Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex flex-row items-center gap-2">
                <div className="bg-slate-700/10 size-10 rounded-md flex items-center justify-center">
                    <ChartPieIcon className="size-5" />
                </div>
                <div >
                    <p className="font-bold">Ticket Breakdown</p>
                    <p className="text-xs text-slate-500">Distribution of tickets by status</p>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-4 px-6 flex-1 @xl/ticketBreakdownChart:grid-cols-2">
                <div className="grid grid-cols-2 justify-between py-6 gap-x-4 gap-y-4 h-fit">
                    {chartData.map((entry) => {
                        const Icon = iconMapping[entry.status] || ChartPie;
                        return (
                            <div key={entry.status} className="flex items-center gap-2 border border-slate-200 rounded-md p-4 h-fit bg-slate-100/20">
                                <div className={`size-8 ${entry.bg} rounded-md border ${entry.border} flex shrink-0 items-center justify-center`}>
                                    <Icon className={`size-4 ${entry.text}`} />
                                </div>
                                <div className="flex flex-row items-center gap-4 justify-between w-full">
                                    <div>
                                        <p className="text-sm font-medium">{entry.status}</p>
                                        <p className="text-xs text-slate-500">tickets</p>
                                    </div>
                                    <div>
                                        <p className={`font-bold text-lg ${entry.text}`}>{entry.count}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <ChartContainer className="w-full flex-1 pb-4 min-h-0 h-full" config={chartConfig}>
                     <PieChart>
                        <ChartTooltip content= {<ChartTooltipContent hideLabel/>} />
                        <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={75} strokeWidth={5}>
                             <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                        >
                                        {chartData.reduce((acc, entry) => acc + entry.count, 0)}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground text-xs"
                                        >
                                        Total Tickets
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                        </Pie>
                     </PieChart>
                </ChartContainer>

            </div>
        </div>
    )
}

export default DashboardTicketBreakdownChart;