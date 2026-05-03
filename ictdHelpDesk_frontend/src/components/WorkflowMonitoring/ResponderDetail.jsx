
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { Circle, CircleChevronDownIcon, CircleDot, CircleEqual, ClipboardCheck, ClipboardCopy, Contact, FileIcon, Flame, Loader, MonitorCog, OctagonAlert, OctagonX, Shield, ShieldUser, Ticket, UserCog, Wrench } from "lucide-react";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Button } from "../ui/button";
import ReportrDialog from "./ReportrDialog";


const ResponderDetail = ({responder, isLoading}) => {
    const [chartData, setChartData] = useState([])
    const [open, setOpen] = useState(false)
    useEffect(() => {
        console.log(responder?.assignedTicket_statistics)
        if (!responder?.assignedTicket_statistics) {
            setChartData([{dataset: "tickets", assigned: 0, responded: 0, resolved: 0, closed: 0, cancelled: 0}])
            return;
        }
        const stats = responder?.assignedTicket_statistics?.reduce((acc, stat) => {
            acc[stat.label.toLowerCase()] = stat.count;
            return acc;
        }, {dataset: "tickets"});

        setChartData([stats]);
    }, [responder])

    
    return (
        <>
            <div className="py-2 px-4 border-b flex flex-row justify-between items-center gap-2">
                <div className="flex flex-row gap-4 items-center">
                    <SidebarTrigger/>
                    <p className="font-medium text-xs">Responder Details</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Button variant="ghost" className="text-xs py-2" onClick={() => setOpen(true)} disabled={!responder?.assigned_tickets || responder?.assigned_tickets?.length === 0}>
                        <ClipboardCopy className="size-4"/>
                        Export Officer Performance Report
                    </Button>
                </div>
            </div>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 flex-1">
                        {
                            !responder.id ? 
                            <div className="flex flex-row gap-3 items-center flex-1 justify-center">
                                <Loader className="animate-spin" size={40}/>
                                <div className="flex flex-col items-start">
                                    <p className="md:text-xl font-bold font-google">Loading Officer</p>
                                    <p className="font-google font-regular text-gray-400 text-xs">If this takes too long, please refresh the page.</p>
                                </div>
                            </div>
                            : 
                            <div className="flex flex-col px-6 justify-between gap-10 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-5">
                                    <div className="col-span-2 flex flex-col items-start gap-2">
                                        <div className="flex flex-col">
                                            <p className="font-bold">Respondent </p>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <div>
                                                <Avatar className="size-18 border rounded-md ">
                                                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${responder?.firstName} ${responder?.lastName}`} alt="User Profile" />
                                                    <AvatarFallback>{responder?.username?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div >
                                                <p className="font-bold text-2xl">{responder?.firstName} {responder?.lastName}</p>
                                                <p className="text-sm text-slate-700">{responder?.designation}</p>
                                                <p className="text-xs text-slate-500">{responder?.office_department_division?.name} - {responder?.office_department_division?.officeCode}</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-col flex-1 col-span-3 w-full gap-2">
                                        <div className="flex flex-row justify-between">
                                            <div>
                                                <p className="font-bold">Responder's Tickets</p>
                                                <p className="text-xs text-slate-500">Number of ticket that the officer has responded to or involved-in</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <div className="flex flex-col items-end">
                                                    <p className="text-slate-500 text-xs">Ticket Count</p>
                                                    <p className="font-bold">{responder?.assigned_tickets?.length || 0} {responder?.assigned_tickets?.length === 1 ? 'ticket' : 'tickets'}</p>
                                                </div>
                                                <div className="bg-slate-500/20 size-9 rounded-md flex justify-center items-center">
                                                    <Ticket className="size-5"/>
                                                </div>
                                            </div>
                                        </div>
                                        <ChartContainer config={chartConfig} className="h-10 w-full">
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                            layout="vertical"
                                            className="w-full"
                                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                                        >
                                            <XAxis type="number" domain={[0, chartData ? 1 : 1]} hide />
                                            <YAxis
                                                dataKey="dataset"
                                                type="category"
                                                hide
                                            />
                                            <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                            />
                                            {
                                                Object.keys(chartConfig).map((key, index) => {
                                                    const keys = responder?.assignedTicket_statistics
                                                    const isFirst = index === 0;
                                                    const isLast = index === keys.length - 1;
                                                    let barRadius = [0, 0, 0, 0];

                                                    if (isFirst) barRadius = [5, 0, 0, 5]; 
                                                    if (isLast) barRadius = [0, 5, 5, 0];  
                                                    if (isFirst && isLast) barRadius = [5, 5, 5, 5]; 

                                                    return (
                                                        <Bar key={key} dataKey={key.toLowerCase()} fill={chartConfig[key].color} stackId="a" radius={barRadius}/> 
                                                    )
                                                })
                                            }
                                        </BarChart>
                                        </ChartContainer>
                                        <div className="grid grid-cols-5 gap-2">
                                            {   

                                                Object.keys(chartConfig).map((key) => {
                                                    const color = chartConfig[key].color
                                                    const stats = chartData[0]?.[key.toLowerCase()] || 0;
                                                    return (
                                                        (
                                                            <div key={key} className="flex flex-row items-center justify-center gap-1">
                                                                <div className={`size-3 rounded-xs bg-[${color}]`}style={{ backgroundColor: color }}/>
                                                                <p className="text-xs text-slate-500">{chartConfig[key].label} - {stats} {1 === stats ? 'ticket' : 'tickets'}  </p>
                                                            </div>
                                                        )
                                                    )
                                                }) 
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    responder?.assigned_tickets.length === 0 ?
                                    <div className="flex flex-col flex-1 h-full justify-between">
                                        <div className="overflow-hidden rounded-lg border flex flex-col h-full">
                                            <div className="p-4 bg-accent/10 border-b">
                                                <div className="flex flex-row gap-2 items-center">
                                                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                                                        <Ticket />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">Ticket List</p>
                                                        <p className="text-xs text-slate-500">List of all assigned tickets and their statuses that they are involved</p>
                                                    </div>
                                                </div>
                                            </div>
                                        <div className="flex flex-col items-center gap-2 justify-center flex-1">
                                            <div className="bg-slate-500/20 size-20 rounded-md flex justify-center items-center">
                                                <OctagonX className="size-10"/>
                                            </div>
                                            <div className="flex flex-col items-center ">
                                                <p className="font-bold text-lg">No Assigned Tickets</p>
                                                <p className="text-sm text-slate-500">This officer has not been assigned to any tickets yet.</p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                                                :
                                    <DataTable assignedTickets={responder?.assigned_tickets} isloading={isLoading}  responder={responder} />
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <ReportrDialog open={open} onOpenChange={setOpen} selectedRespondent={responder} reportType="performance" />
        </>
    )
}

export default ResponderDetail

const ticketStatus = [
        {
            icon: FileIcon,
            text: "Total Tickets",
            siteHeader : "Active",
            userHeader : "Total Tickets",
            color: "bg-blue-500/50",
            textColor: "text-blue-800",
            border: "border-blue-500"
        },
            {
                icon: Wrench,
                text: "Responded Tickets",
                siteHeader : "Responded",
                userHeader : "Responded Tickets",
                color: "bg-green-500/50",
                textColor: "text-green-800",
                border: "border-green-500"
            },
            {
                icon: ClipboardCheck,
                text: "Resolved Tickets",
                siteHeader : "Resolved",
                userHeader : "Resolved Tickets",
                color: "bg-yellow-500/50",
                textColor: "text-yellow-800 ",
                border: "border-yellow-500"
            },
            {
                icon: CircleDot,
                text: "Closed Tickets",
                siteHeader : "Closed",
                userHeader : "Closed Tickets",
                color: "bg-slate-500/50",
                textColor: "text-slate-800",
                border: "border-slate-500"
            },
        
    ]

const chartConfig = {
    Assigned: {
        label: "Assigned",
        color: "#3b82f6"
    },
    Responded: {
        label: "Responded",
        color: "#10b981"
    },
    Resolved: {
        label: "Resolved",
        color: "#f59e0b"
    },
    Closed: {
        label: "Closed",
        color: "#6b7280"
    },
    Cancelled: {
        label: "Cancelled",
        color: "#ef4444"
    }
}

// const chartData = [
//     {dataset: "tickets", assigned: 20, responded: 15, resolved: 5, closedTicket: 2, cancelled: 1},
// ]

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ]