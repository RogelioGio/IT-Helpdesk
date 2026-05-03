import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReportStore } from "@/stores/useReportStore";
import { Flame, LayoutList, Ticket, Wrench } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Bar, BarChart, Pie, PieChart, XAxis, YAxis } from "recharts";

const ContentTableAndReport = ({data}) => {
    const {setParams} = useReportStore();
    const {activitySpecifications, activities, activitySpecificationsPerActivity} = data;
    const [activitySpecificationList, setActivitySpecificationList] = useState([]);
    const [chartConfig, setChartConfig] = useState({});
    const [chartData, setChartData] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState({});
    const defaultChartConfig = () => {
        const monotonePalette = [
            "#1e3a8a", // Blue 900
            "#1e40af", // Blue 800
            "#1d4ed8", // Blue 700
            "#2563eb", // Blue 600
            "#3b82f6", // Blue 500
            "#60a5fa", // Blue 400
            "#93c5fd", // Blue 300
        ];
            if(activities && activities.length > 0) {
                return activities.reduce((acc, item, index) => {
                acc[item.label] = {
                    label: item.label,
                    color: monotonePalette[index % monotonePalette.length],
                };
                return acc;
            },{})} else {
                return {};
            }
        }
    const defaultChartData = () => {
        if(activities && activities.length > 0) {
            const data = activities.reduce((acc, item) => {
                acc[item.label] = item.count;
                return acc;
            }, {dataset: "activities"});
            return data
        } else {
            return {};
        }
    }

    const HighestCountForActivity = (activities) => {
        if(!activities || activities.length === 0) return {};
        const highestCount = Math.max(...activities.map(item => item.count));

        const totalTickets = activities.reduce((sum, item) => sum + item.count, 0);
        const highestPercentage = totalTickets > 0 ? ((highestCount / totalTickets) * 100).toFixed(2) : 0;
        const highestActivity = activities.find(item => item.count === highestCount);

        return {...highestActivity, percentage: highestPercentage};
    }
    const RankingForActivity = (activities, currentItem) => {
        console.log("activities", activities, "and ", currentItem);
        if(!activities || activities.length === 0) return {};
        const sorted = [...activities].sort((a, b) => b.count - a.count);
        let rank = 1;

        const ranklist = sorted.map((item, index) => {
            if (index > 0 && item.count < sorted[index - 1].count) {
                rank = index + 1;
            }
            return {...item, rank:rank };
        })

        const result = ranklist.find(item => item.label === currentItem.label)

        const totalTickets = activities.reduce((sum, item) => sum + item.count, 0);
        const activityTotalTicket = result.count

        const percentage = totalTickets > 0 ? ((activityTotalTicket / totalTickets) * 100).toFixed(2) : 0;

        const item = {...result,  percentage:percentage}

        return item
    }
    const HighestCountForActivitySpecification = (activitySpecification) => {
        if(!activitySpecification || activitySpecification.length === 0) return {};
        const highestCount = Math.max(...activitySpecification.map(item => item.count));
        const highestSpec = activitySpecification.find(item => item.count === highestCount);

        const totalTickets = activitySpecification.reduce((sum, item) => sum + item.count, 0);
        const highestPercentage = totalTickets > 0 ? ((highestCount / totalTickets) * 100).toFixed(2) : 0;

        return {...highestSpec, percentage: highestPercentage};
    }


    const filterActivitySpecification = (activity) => {
        if(activity === "all") {
            setParams({activity_id: null})
            setActivitySpecificationList(activitySpecifications);
            setChartConfig(defaultChartConfig());
            setChartData(defaultChartData());
            setSelectedActivity({});
            return;
        }
        //for exporting report with activity filter
        setParams({activity_id: activities.find(item => item.label === activity).id})
        const selected = activities.find(item => item.label === activity);
        setSelectedActivity(selected);

        const filteredList = activitySpecificationsPerActivity.find((item) => item.activity === activity)

        setActivitySpecificationList(filteredList.specification)
        
        const chartrData = filteredList.specification.reduce((acc, item) => {
            acc[item.name] = item.count;
            return acc;
        }, {dataset: "activitySpecification"});
        setChartData(chartrData);
        console.log("chartrData", chartrData);
        const monotonePalette = [
            "#1e3a8a", // Blue 900
            "#1e40af", // Blue 800
            "#1d4ed8", // Blue 700
            "#2563eb", // Blue 600
            "#3b82f6", // Blue 500
            "#60a5fa", // Blue 400
            "#93c5fd", // Blue 300
        ];
        const chartConfig = filteredList.specification.reduce((acc, item, index) => {
            acc[item.name] = {
                label: item.name,
                color: monotonePalette[index % monotonePalette.length],
            }
            return acc;
        },{});
        setChartConfig(chartConfig);
        
    }

    useEffect(() => {
        if(!activities && !activitySpecifications) return;
        setActivitySpecificationList(activitySpecifications);
        setChartConfig(defaultChartConfig());
        setChartData(defaultChartData());
    }, [data])

    // useEffect(() => {
    //     console.log(chartData);
    // }, [chartData])

    // const [data, setData] = useState(tableData);

    return (
        <div className="w-full border rounded-md flex flex-col min-h-0 overflow-hidden flex-1" >
            <div className="p-4 bg-accent/10 border-b flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                        <LayoutList />
                    </div>
                    <div>
                        <p className="font-bold">Activity Specification Breakdown</p>
                        <p className="text-xs text-slate-500">Detailed breakdown of activities and their specifications</p>
                    </div>
                </div>
                <Select onValueChange={(value) => filterActivitySpecification(value)} defaultValue="all">
                    <SelectTrigger className="w-70">
                        <SelectValue placeholder="Select Activity" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    {
                        activities ? 
                            <SelectGroup>
                                <SelectLabel>Ticket Activities</SelectLabel>
                                {
                                    activities.map((item, index) => (
                                        <SelectItem key={index} value={item.label}>
                                            {item.label}
                                        </SelectItem>

                                    ))
                                }
                            </SelectGroup>
                        : null
                    }
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 flex-1 min-h-0">
                {/* Activity Specification */}
                <div className="col-span-3 border-r h-full flex">
                    <ScrollArea className="flex-1">
                        <div className="max-h-0">
                            {
                                activitySpecifications ?
                                activitySpecificationList?.map((item, index) => {
                                    return (
                                        <div className={`p-4 items-center border-b flex flex-row justify-between w-full ${index === activitySpecificationList.length - 1 ? 'border-b-0' : ''}`} key={index}>
                                            <div>
                                                <p className="font-bold">{item.name} <span className="text-xs font-normal text-slate-500">- {item.activity}</span></p>
                                                <p className="text-xs text-slate-500">{item.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2   ">
                                                <p className="text-xs text-slate-500">Ticket Count</p>
                                                <div className="flex flex-row items-center gap-2">
                                                    <p className="text-lg font-bold">{item.count} {item.count > 1 ? 'Tickets' : 'Ticket'}</p>
                                                    <div className="bg-slate-400/20 rounded-md size-8 flex items-center justify-center">
                                                        <Ticket className={`size-4`}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : null
                            }
                        </div>
                    </ScrollArea>
                </div>
                <div className="flex flex-col">
                    <div>
                        <div className="p-4 flex flex-col items-center">
                            <p className="font-bold">Incident Density</p>
                            {
                                selectedActivity.label ?
                                <p className="text-xs text-slate-500">Overall incident density {selectedActivity.label}</p>
                                :
                                <p className="text-xs text-slate-500">Overall incident density of ticket activities</p>
                            }
                        </div>
                        <ChartContainer config={chartConfig} className="w-full max-h-30">
                                <BarChart data={chartData ? [chartData] : []} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                    <XAxis type="number" hide domain={[0, chartData ? Object.values(chartData).reduce((max, val) => Math.max(max, val), 0) : 0]} />
                                    <YAxis 
                                        dataKey="dataset" 
                                        type="category" 
                                        width={100} 
                                        hide
                                    />
                                    {
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
                                    }
                                    <ChartLegend content={<ChartLegendContent />}/>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                                </BarChart>
                        </ChartContainer>
                        <div className="p-4 text-center">
                            {
                                selectedActivity.label ?
                                <p className="text-xs text-slate-400">{selectedActivity.label} has an incident density of {selectedActivity.count} tickets</p>
                                :
                                <p className="text-xs text-slate-400">All activities have a combined incident density of {activities ? activities.reduce((sum, item) => sum + item.count, 0) : 0} tickets</p>
                            }
                        </div>
                    </div>
                    <div className="border-t p-4 flex flex-col flex-1 gap-2">
                        {
                            selectedActivity.label ? 
                            <>
                            <div className="flex flex-row items-center gap-3">
                                <div>
                                    <p className="font-bold text-sm">Ticket Activity Statistics</p>
                                    <p className="text-xs text-slate-500">Count of tickets and its ranking</p>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex flex-row justify-between flex-1">
                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="shrink-0 size-10 bg-slate-500/10 rounded-md flex items-center justify-center ">
                                            <p className="text-lg font-bold">{RankingForActivity(activities, selectedActivity).rank}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activities ? RankingForActivity(activities, selectedActivity).label : ''}</p>
                                            <p className="text-xs text-slate-500">{RankingForActivity(activities, selectedActivity).count} reported related tickets</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between">
                                        <p className="font-medium text-sm">Density Percentage</p>
                                        <p className="font-medium text-sm">{RankingForActivity(activities, selectedActivity).percentage}%</p>
                                </div>
                            </div>
                            </> : 
                            <>
                            <div className="flex flex-row items-center gap-3">
                                <div>
                                    <p className="font-bold text-sm">Top Activity Issued</p>
                                    <p className="text-xs text-slate-500">Highest activity issued count by ticket count</p>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex flex-row justify-between flex-1">
                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="shrink-0 size-10 bg-slate-500/10 rounded-md flex items-center justify-center ">
                                            <Flame className="size-5"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activities ? HighestCountForActivity(activities).label : ''}</p>
                                            <p className="text-xs text-slate-500">{HighestCountForActivity(activities).count} reported related tickets</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between">
                                        <p className="font-medium text-sm">Density Percentage</p>
                                        <p className="font-medium text-sm">{HighestCountForActivity(activities).percentage}%</p>
                                </div>
                            </div>
                            </>

                        }
                    </div>
                    <div className="border-t p-4 flex flex-col flex-1 gap-2">
                        <div className="flex flex-row items-center gap-3">
                            <div>
                                <p className="font-bold text-sm">Top Activity Specification Issued</p>
                                {
                                    selectedActivity.label ?
                                    <p className="text-xs text-slate-500">Top specification for {selectedActivity.label} activity</p>
                                    : 
                                    <p className="text-xs text-slate-500">Highest activity issued count by ticket count overall</p>
                                }
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex flex-row justify-between flex-1">
                                <div className="flex flex-row gap-2 items-center">
                                    
                                    <div className="shrink-0 size-10 bg-slate-500/10 rounded-md flex items-center justify-center ">
                                        <Flame className="size-5"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{activities ? HighestCountForActivitySpecification(activitySpecificationList).name : ''}</p>
                                        <p className="text-xs text-slate-500">{HighestCountForActivitySpecification(activitySpecificationList).count} reported related tickets</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
                                    <p className="font-medium text-sm">Specification Density Percentage</p>
                                    <p className="font-medium text-sm">{HighestCountForActivitySpecification(activitySpecificationList).percentage}%</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ContentTableAndReport;