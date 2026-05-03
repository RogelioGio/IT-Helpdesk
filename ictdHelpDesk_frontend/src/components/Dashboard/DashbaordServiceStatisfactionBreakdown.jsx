import { BadgeCheck, MonitorCog } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ScrollArea } from "../ui/scroll-area";
import { useMemo } from "react";


const DashboardServiceStatisfactionBreakdown = () => {
    const chartConfig = useMemo(() => ({
        rating: {
            label: "Satisfaction Rating",
            color: "#64748b",
        }
    }), []);
    
    const chartData = [
    { rating: "Responsiveness", score: 50 },
    { rating: "Timelines", score: 40 },
    { rating: "Quality", score: 30 },
    { rating: "Availability", score: 20 },
    { rating: "Overall", score: 10 },
    { rating: "Other", score: 5 },
    ]


    const data = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        activitySpecification: `Service ${String.fromCharCode(65 + i)}`,
        feedbackCount: Math.floor(Math.random() * 100),
        satisfactionRate: Math.floor(Math.random() * 100)
    })), [])


    return (
        <div className="border border-slate-200 bg-slate-200/10 rounded-md h-full xl:h-100 overflow-hidden md:col-span-4 col-span-1 flex flex-col @container/ticketServiceSatisfactionBreakdownChart">
            <div className="p-4 px-6 border-b border-slate-200 flex flex-row items-center gap-2">
                <div className="bg-slate-700/10 size-10 rounded-md flex items-center justify-center">
                    <MonitorCog className="size-5" />
                </div>
                <div >
                    <p className="font-bold">Service Satisfaction Breakdown</p>
                    <p className="text-xs text-slate-500">List of services along with their feedbacks count and computed satisfaction rate </p>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-4 flex-1 min-h-0 @xl/ticketServiceSatisfactionBreakdownChart:grid-cols-4">
                <ServicesSatisfactionTable/>
                <RadarChartComponent chartData={chartData} chartConfig={chartConfig} className="col-span-1"/>
                
            </div>
        </div>
    )
}

export default DashboardServiceStatisfactionBreakdown;


const RadarChartComponent = ({chartData, chartConfig}) => (
    <div className="flex flex-col h-full min-h-0 py-4 gap-4">
    
    <div className="text-center">
        <p className="font-medium m-0"> Overall Satisfaction Breakdown</p>
        <p className="text-xs text-slate-500 m-0">Breakdown of satisfaction ratings across different dimensions</p>
    </div>
    
    <ChartContainer className="w-full flex-1 min-h-0 h-full" config={chartConfig}>
        <RadarChart data={chartData}>
            <ChartTooltip cursor={false}  content={<ChartTooltipContent/>}/>
            <PolarAngleAxis dataKey="rating" />
            <PolarGrid/>
            <Radar dataKey="score" name="Satisfaction Score" stroke="#8884d8" fill="var(--color-rating)" fillOpacity={0.6} />
        </RadarChart>
    </ChartContainer>
    
    </div>
)


const ServicesSatisfactionTable = () => (
    <div className="col-span-3 border-r border-slate-200 flex flex-col h-full min-h-0">
        <ScrollArea className="flex-1 h-full overflow-hidden">
            {
                Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="py-4 px-6 border-b border-slate-200 flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row">
                                <div className="bg-slate-600/10 size-10 rounded-md flex items-center justify-center">
                                    <BadgeCheck className="size-5" />
                                </div>
                            </div>
                            <div>
                                <p className="font-medium m-0">Service {String.fromCharCode(65 + i)}</p>
                                <p className="text-xs text-slate-500 m-0">Feedback Count: {Math.floor(Math.random() * 100)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 m-0">Satisfaction Rate</p>
                            <p className="font-medium m-0">{Math.floor(Math.random() * 100)}%   </p>
                        </div>
                    </div>
                ))
            }
        </ScrollArea>
    </div>
);
