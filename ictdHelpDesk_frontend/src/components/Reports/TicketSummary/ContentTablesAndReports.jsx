import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, CircleChevronDown, CircleDot, CircleEqualIcon, CircleMinus, ClipboardCheck, Flame, LineChart, MessageCircleQuestion, OctagonAlert, Ticket, UserCog, Wrench, X } from "lucide-react"
import { useEffect, useState } from "react";
import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { array } from "yup"

const ticketDistribution = {
    open : {
        label: "Open Ticket",
        color: "text-blue-700",
        bg:"bg-blue-700/10",
        icon: MessageCircleQuestion,
        shortDesc: "awaiting action.",
    },
    assigned: {
        label: "Assigned Ticket",
        color: "text-purple-700",
        bg: "bg-purple-700/10",
        icon: UserCog,
        shortDesc: "have been assigned",
    },
    responded: {
        label: "Responded Ticket",
        color: "text-yellow-700",
        bg: "bg-yellow-700/10",
        icon: Wrench,
        shortDesc: "have received a response",
    },
    resolved: {
        label: "Resolved Ticket",
        color: "text-emerald-700",
        bg: "bg-emerald-700/10",
        icon: ClipboardCheck,
        shortDesc: "have been resolved.",
    },
    closed: {
        label: "Closed Ticket",
        color: "text-zinc-950",
        bg: "bg-zinc-950/10",
        icon: CircleDot,
        shortDesc: "have been closed.",
    },
    cancelled: {
        label: "Cancelled Ticket",
        color: "text-slate-700",
        bg: "bg-slate-700/10",
        icon: CircleMinus,
        shortDesc: "have been cancelled.",
    }
}
const ticketCriticalityDistributionChartConfig = {
    low: {
        label: "Low Priority",
        color: "#3b82f6",
        bg: "bg-blue-500/10",
        shortDesc: "have low urgency",
    },
    medium: {
        label: "Medium Priority",
        color: "#eab308",
        bg: "bg-yellow-500/10",
        shortDesc: "have moderate urgency ",

    },
    high: {
        label: "High Priority",
        color: "#ea580c",
        bg: "bg-orange-600/10",
        shortDesc: "have high urgency",
    },
    critical: {
        label: "Critical Priority",
        color: "#dc2626",
        bg: "bg-red-600/10",
        shortDesc: "have critical urgency",
    },
}
    
const ContentTablesAndReports = ({data}) => {
    const {ticketCriticalitySummary, ticketCriticalityBreakdown, departmentBreakdown, totalTickets} = data || {};
    const defaultIndex = {
        chartData: [ticketCriticalityBreakdown],
        ...ticketCriticalitySummary,
        totalTickets
    }
    const [criticalIndex, setCriticalIndex] = useState(defaultIndex);
    return (
        <div className="w-full border rounded-md flex flex-col min-h-0 overflow-hidden flex-1" >
            <div className="p-4 bg-accent/10 border-b">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                        <Ticket />
                    </div>
                    <div>
                        <p className="font-bold">Volume Density Distribution</p>
                        <p className="text-xs text-slate-500">ticket volume distribution across different departments/office/divisions</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 flex-1 min-h-0">
                {/* department list */}
                <div className="col-span-3 border-r h-full flex">
                    <ScrollArea className="flex-1">
                        <div className="max-h-0">
                            {
                                departmentBreakdown ? 
                                departmentBreakdown.map((department, index) => {
                                    const isFew = index < 3;
                                    const departmentData = {
                                        department: department.department,
                                        chartData: [department.criticalityBreakdown],
                                        ...department.ticketCriticalitySummary,
                                        totalTickets: department.totalTickets,
                                    }


                                    return(
                                         <div key={index} className={`border-b ${isFew ? '' : 'border-b-0'} hover:bg-slate-100 cursor-pointer`} onClick={() => console.log("Clicked department:", setCriticalIndex(departmentData))}>
                                            <div className="flex flex-row justify-between items-center border-b p-4">
                                                <div>
                                                    <p className="font-semibold">{department.department} <span className="text-xs text-slate-500 font-thin">{department.departmentCode}</span></p>
                                                    <p className="text-xs text-slate-500"></p>
                                                </div>
                                                <div className="flex flex-row gap-10">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-row gap-2">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <p className="font-medium">{department.totalTickets} tickets</p>
                                                                <div className="bg-slate-400/20 rounded-md size-8 flex items-center justify-center">
                                                                    <Ticket className={`size-4`}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-6 w-full">
                                                    {
                                                        Object.keys(ticketDistribution).map((key) => {
                                                            const {label, icon, color, bg} = ticketDistribution[key];
                                                            const Icon = icon;
                                                            return (     
                                                                    <div className={`border-r p-4 border-r- flex flex-col gap-2 last:border-r-0`} key={key}>
                                                                        <div className="flex flex-row justify-between">
                                                                            <p className={`text-xs `}>{label}</p>
                                                                            <Icon className={`size-4 text-slate-500`}/>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold">{department.ticketBreakdown[key.toLocaleLowerCase()]} {department.ticketBreakdown[key.toLocaleLowerCase()] > 1 ? 'ticket' : 'tickets'}</p>
                                                                            <p className="text-xs text-slate-500">{ticketDistribution[key].shortDesc}</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                        })
                                                    }
                                                </div>
                                        </div>
                                    )
                                }) : null
                            }
                        </div>
                    </ScrollArea>
                </div>
                <div className="flex flex-col relative">
                    {
                        criticalIndex.department &&
                        <div className="absolute left-4 top-4 hover:bg-slate-200 rounded-full p-1 cursor-pointer" onClick={() => setCriticalIndex(defaultIndex)}>
                            <ArrowLeft className="size-4"/>
                        </div>
                    }
                    <div className="border-b flex flex-col h-1/2">
                        <div className="p-4 text-center shrink-0">
                            <p className="font-bold">Ticket Criticality Breakdown</p>
                            <p className="text-xs text-slate-500">
                                {
                                    criticalIndex.department ? `Criticality distribution for ${criticalIndex.department} with ${criticalIndex.totalTickets || 0} tickets` : "Overall criticality distribution across all tickets"
                                }
                            </p>
                        </div>
                        <div className="flex-1 flex items-center justify-center min-h-0 relative">
                            <ChartContainer config={ticketCriticalityDistributionChartConfig} className="w-full aspect-square max-h-55">
                                <RadialBarChart data={criticalIndex ? criticalIndex.chartData : []} endAngle={180} innerRadius="90%" outerRadius="120%" startAngle={0} cx="50%" cy="75%">
                                    <PolarAngleAxis
                                        type="number"
                                        domain={[0,  criticalIndex.totalAssignedCriticality || 0]} // Matches your totalTickets
                                        tick={false}
                                    />
                                    <RadialBar dataKey="low" fill="var(--color-low)" stackId = "a" cornerRadius={5} className="stroke-transparent stroke-2"/>
                                    <RadialBar dataKey="medium" fill="var(--color-medium)" stackId = "a" cornerRadius={5} className="stroke-transparent stroke-2"/>
                                    <RadialBar dataKey="high" fill="var(--color-high)" stackId = "a" cornerRadius={5} className="stroke-transparent stroke-2"/>
                                    <RadialBar dataKey="critical" fill="var(--color-critical)" stackId = "a" cornerRadius={5} className="stroke-transparent stroke-2"/>
                                    <ChartTooltip 
                                        cursor={false} 
                                        content={
                                            <ChartTooltipContent 
                                            hideLabel 
                                            indicator="dot" 
                                            />
                                        }
                                        />
                                    <PolarRadiusAxis tickLine={false} axisLine={false} tick={false}>
                                        <Label content={({viewBox}) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) - 30} // Adjusted for your semi-circle cy="100%"
                                                            className="fill-foreground text-3xl font-bold font-google!"
                                                            >
                                                            {criticalIndex.criticalityAverage}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0)}
                                                            className="text-xs fill-slate-500 "
                                                        >Crticality Average</tspan>
                                                    </text>
                                                );
                                            }}
                                        }/>
                                    </PolarRadiusAxis>
                                </RadialBarChart>
                            </ChartContainer>
                        </div>
                        <div className="p-4 text-center shrink-0">
                            {
                                data ? 
                                <p className="text-xs text-slate-500"><strong className="text-primary">{criticalIndex?.totalAssignedCriticality || 0} {criticalIndex?.totalAssignedCriticality === 1 ? 'prioritized ticket' : 'prioritized tickets'}</strong>  and ignoring <strong className="text-primary">{criticalIndex?.notAssigned || 0} {criticalIndex?.notAssigned === 1 ? 'unassigned ticket' : 'unassigned tickets'}</strong></p>
                                :
                                <p className="text-xs text-slate-500">Loading...</p>
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-2 auto-rows-fr h-1/2">
                        {
                            Object.keys(ticketCriticalityDistributionChartConfig).map((key, index) => {
                                const config = ticketCriticalityDistributionChartConfig[key];
                                
                                const iconMap = {
                                    low: CircleChevronDown,
                                    medium: CircleEqualIcon,
                                    critical: Flame,
                                    high: OctagonAlert,
                                }
                                const Icon = iconMap[key];

                                const count = criticalIndex.chartData[0]?.[key] ?? 0;

                              return (
                                    <div className={`border-r border-b ${(index + 1) % 2 === 0 ? 'border-r-0' : ''} ${(index + 1) === 3 || (index + 1) === 4 ? 'border-b-0' : ''}`} key={key}>
                                        <div className="p-4 flex flex-col">
                                            <div className="flex flex-row justify-between">
                                                <p className="text-xs">{config.label}</p>
                                                <Icon className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-medium">
                                                    {count} {count > 1 ? 'tickets' : 'ticket'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">{config.shortDesc}</p>
                                            </div>
                                        </div>
                                    </div>
                              )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ContentTablesAndReports