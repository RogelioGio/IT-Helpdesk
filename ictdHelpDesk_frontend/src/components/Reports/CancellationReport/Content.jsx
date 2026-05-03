import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReportStore } from "@/stores/useReportStore";
import { set } from "date-fns";
import { ClipboardListIcon, Wrench } from "lucide-react";
import { use, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const Content = ({data}) => {
    const {setParams} = useReportStore();
    const {cancellation_reason_data, cancellation_data_summary, cancelledTicketByDepartment, cancelledTicketByActivitySpecification} = data||{};
    const [rankListDepartment, setRankListDepartment] = useState([]);
    const [rankListActivitySpecification, setRankListActivitySpecification] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [chartConfig, setChartConfig] = useState({});
    const [frequencyList, setFrequencyList] = useState([]);
    const redPalette = [
        "#2d0606", // 1. "Black Bean" (Darkest depth) - NOW AT INDEX 0
        "#450a0a", // 2. Rich Black-Red
        "#6b1010", // 3. Deep Blood Red
        "#7f1d1d", // 4. Dark Maroon
        "#991b1b", // 5. Saturated Deep Red
        "#b91c1c", // 6. Medium Dark Red
        "#dc2626", // 7. Standard Red
        "#ef4444", // 8. Primary UI Accent
        "#f87171", // 9. Soft Candy Red
        "#fca5a5"  // 10. Muted Coral (Lightest)
    ];

    

    useEffect(() => {
        if(!cancellation_reason_data) {
            setChartData([{}]);
            setChartConfig({});
            return
        }

        const rankedList = [...cancellation_reason_data].sort((a, b) => b.cancelled_tickets_count - a.cancelled_tickets_count);
        setRankListDepartment([...cancelledTicketByDepartment].sort((a, b) => b.cancelled_tickets_count - a.cancelled_tickets_count));
        setRankListActivitySpecification([...cancelledTicketByActivitySpecification].sort((a, b) => b.cancelled_tickets_count - a.cancelled_tickets_count));

        const formattedChartData = rankedList.reduce((acc, item) => {
            acc[item.reason] = item.cancelled_tickets_count;
            return acc;
        }, {dataset: "reasons"});
        setChartData([formattedChartData]);

        const formattedChartConfig = rankedList.reduce((acc, item, index) => {
            acc[item.reason] = {
                label: item.reason,
                color: redPalette[index % redPalette.length]
            }
            return acc;
        }, {});
        setChartConfig(formattedChartConfig);
        setFrequencyList([...cancelledTicketByDepartment].sort((a, b) => b.cancelled_tickets_count - a.cancelled_tickets_count));

    }, [data]);



    return (
       <div className="w-full grid grid-cols-2 gap-4 min-h-0 overflow-hidden flex-1" >
            <div className="w-full border rounded-md flex flex-col min-h-0">
                <div className="p-4 bg-accent/10 border-b">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                            <Wrench />
                        </div>
                        <div>
                            <p className="font-bold">Cancellation Reasons Statistics</p>
                            <p className="text-xs text-slate-500">List and ranking of cancellation reasons by ticket counts</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-b">
                    <div className="flex flex-row justify-between">
                        <p className="font-bold">Cancelled Ticket Distribution</p>
                        <p className="text-xs text-slate-500">Ditribution of cancelled tickets by thier reasoning of canellation</p>
                    </div>
                    <ChartContainer config={chartConfig} className=" h-10 w-full">
                        <BarChart data={chartData} layout="vertical" margin={0}>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                            <YAxis 
                                        dataKey="dataset" 
                                        type="category" 
                                        width={100} 
                                        hide
                                    />
                            <XAxis type="number" hide domain={[0, cancellation_data_summary ? cancellation_data_summary.total_cancelled_tickets : 100]} />
                            {
                                cancellation_reason_data ? 
                                Object.keys(chartConfig).map((key, index) => {
                                    const keys = Object.keys(chartConfig);
                                    const isFirst = index === 0;
                                    const isLast = index === keys.length - 1;
                                    
                                    let barRadius = [0, 0, 0, 0];

                                    if (isFirst) barRadius = [5, 0, 0, 5]; 
                                    if (isLast) barRadius = [0, 5, 5, 0];  
                                    if (isFirst && isLast) barRadius = [5, 5, 5, 5]; 

                                    return (
                                        <Bar key={index} dataKey={key} stackId="a" fill={chartConfig[key].color} radius={barRadius}/>
                                    )
                                })
                                :
                                null
                            }

                        </BarChart>
                    </ChartContainer>
                </div>
                <div className="flex flex-col flex-1">
                    <ScrollArea className="flex-1">
                        <div className="max-h-0">
                            {
                                cancellation_reason_data ? 
                                Object.keys(chartConfig).map((item, index) => {
                                    const reasonData = cancellation_reason_data.find(reason => reason.reason === item);
                                    const color = chartConfig[item].color;
                                    return (
                                            <div key={index} className="flex flex-row items-center justify-between p-4 border-b">
                                                <div className="flex flex-row gap-4 items-center">
                                                    <div className="size-10 bg-slate-500/20 rounded-md flex items-center justify-center">
                                                        <p className="font-bold">{index + 1}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{reasonData.reason}</p>
                                                        <p className="text-xs text-slate-500">{reasonData.count} Issued Cancellations</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex flex-row gap-2">
                                                        <p className="font-bold">{reasonData.percentage}%</p>
                                                        <div className={`size-5 rounded-sm `} style={{ backgroundColor: color }}/>
                                                    </div>
                                                    <p className="text-xs text-slate-500">Percent in total cancelled tickets</p>
                                                </div>
                                            </div>
                                    )
                                    
                                })
                                : null
                            }
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <div className="w-fulll border rounded-md flex flex-col">
                <div className="p-4 bg-accent/10 border-b flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                            <ClipboardListIcon />
                        </div>
                        <div>
                            <p className="font-bold">Cancellation Frequencies</p>
                            <p className="text-xs text-slate-500">List and ranking of cancellation frequencies</p>
                        </div>
                    </div>
                    <Select onValueChange={(value) => {
                        if(value === "department") {
                            setFrequencyList(rankListDepartment);
                        } else if(value === "activity") {
                            setFrequencyList(rankListActivitySpecification);
                        }
                    }} defaultValue="department">
                        <SelectTrigger className="w-65">
                            <SelectValue placeholder="Filter by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="department">By Department</SelectItem>
                            <SelectItem value="activity">By Activity Specification</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col flex-1">
                    <ScrollArea className="flex-1">
                        <div className="max-h-0">
                            {
                                frequencyList ? 
                                frequencyList.map((item, index) => (
                                    <div className="flex flex-col gap-4 p-4 border-b" key={index}>
                                        <div key={index} className="flex flex-row items-center justify-between">
                                            <div className="flex flex-row gap-4 items-center">
                                                <div className="size-10 bg-slate-500/20 rounded-md flex items-center justify-center">
                                                    <p className="font-bold">{index + 1}</p>
                                                </div>
                                                <div>
                                                    <p className="font-bold">{item.name} <span className="text-xs text-slate-500 font-normal">- {item?.officeCode || null}</span></p>
                                                    <p className="text-xs text-slate-500">{item.cancelled_tickets_count} Issued Cancellations</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                 <p className="text-xs text-slate-500">Percent in total cancelled tickets</p>
                                                <div className="flex flex-row gap-2">
                                                    <p className="font-bold">{item.percentage}%</p>
                                                    <div className="size-5 bg-red-500 rounded-sm"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Progress value={item.percentage} className="*:bg-red-500"/>
                                        </div>
                                    </div>
                                )) : null
                            }
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

export default Content;

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "var(--chart-2)",
//   },
// }







