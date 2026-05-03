import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { BadgeCheck, MessageSquare, Wrench } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { date } from "yup";

const HeaderGraph = ({data}) => {
    const {Feedbacks, FeedbackTrendSummary} = data
    console.log("Feedbacks: ", Feedbacks)
    return (
         <div className="w-fulll border rounded-md">
            <div className="p-4 bg-accent/10 border-b">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                        <BadgeCheck />
                    </div>
                    <div>
                        <p className="font-bold">Service Satisfaction Trend</p>
                        <p className="text-xs text-slate-500">Satisfaction trend over time</p>
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-4`}>
                <ChartContainer className="col-span-3 aspect-video w-full flex-1 pb-4 px-6 max-h-80 border-r" config={chartConfig}>
                    <AreaChart data={Feedbacks || []} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="serviceRating" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                    offset="5%"
                                    stopColor="var(--color-serviceRating)"
                                    stopOpacity={0.8}
                                    />
                                    <stop
                                    offset="95%"
                                    stopColor="var(--color-serviceRating)"
                                    stopOpacity={0.1}
                                    />
                                </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={32} 
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return format(date, "MMM")
                            }}
                        />
                        <Area type="monotone" dataKey="serviceRating" stroke={chartConfig.serviceRating.color} fill="url(#serviceRating)" fillOpacity={0.3} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(value) => {const date = new Date(value); return format(date, "MMM dd"); }}/>} />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
                <div className="col-span-1 flex flex-col">
                    <div className="flex  flex-col flex-1 border-b p-4">
                        <div>
                            <p className="font-medium">Current Satisfaction Rating</p>
                            <p className="text-xs text-slate-500">Current Overall Satisfaction Rating</p>
                        </div>
                        <div className="flex-1 flex flex-row gap-2 items-center">
                                <div className="size-14 rounded-md bg-green-200/40 flex items-center justify-center ">
                                    <Wrench className="size-7 text-green-500"/>
                                </div>
                            <div>
                                <p className="text-2xl font-bold">{FeedbackTrendSummary.CurrentMonthServiceSatifaction || 0}<span className="text-sm font-medium text-slate-500"> / 5.0</span></p>
                                <p className="text-xs text-slate-500">Satisfaction Rating</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex  flex-col flex-1 p-4">
                        <div>
                            <p className="font-medium">Total Feedback</p>
                            <p className="text-xs text-slate-500">Number of feedback entries that used to compute the satisfaction.</p>
                        </div>
                         <div className="flex-1 flex flex-row gap-2 items-center">
                               <div className="size-14 rounded-md bg-green-200/40 flex items-center justify-center ">
                                    <MessageSquare className="size-7 text-green-500"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{FeedbackTrendSummary.TotalFeedbackCount || 0}</p>
                                    <p className="text-xs text-slate-500">Total Feedback</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderGraph;

const chartConfig = {
    serviceRating: {
        label: "Service Rating",
        color: "#4ade80"
    }
}

const chartData = [
    {date: "2024-01-01", serviceRating: 4.5},
    {date: "2024-02-02", serviceRating: 4.0},
    {date: "2024-03-03", serviceRating: 4.2},
    {date: "2024-04-04", serviceRating: 4.8},
    {date: "2024-05-05", serviceRating: 4.6},
    {date: "2024-06-06", serviceRating: 4.3},
    {date: "2024-07-07", serviceRating: 4.7},
    {date: "2024-08-08", serviceRating: 4.4},
    {date: "2024-09-09", serviceRating: 4.9},
    {date: "2024-10-10", serviceRating: 4.5},
    {date: "2024-11-11", serviceRating: 4.6},
    {date: "2024-12-12", serviceRating: 4.8},
]