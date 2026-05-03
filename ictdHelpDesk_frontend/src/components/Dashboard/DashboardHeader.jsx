import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { CircleMinus, ClockAlert, MonitorCog, Ticket, TrendingDown, TrendingUp } from "lucide-react";
import { use, useEffect, useState } from "react";
import axiosClient from "@/AxiosClient";
import { echoInstance } from "@/echo";
import { useAuth } from "@/contexts/AuthProvider";
import { format, formatDistanceToNow } from "date-fns";


const DashboardHeader = ({data}) => {
    const {user} = useAuth();
    const [dashboardHeaderData, setDashboardHeaderData] = useState({});
        useEffect(() => {
            if(data) {
                console.log("Received dashboard header data:", data);
                setDashboardHeaderData(data);
            }
        }, [data]);
        
        useEffect(() => {
            setDashboardHeaderData(dashboardHeaderData);
        }, [dashboardHeaderData]);

        useEffect(() => {
            if(!user || !user.id) return;
            const channel = "dashboard-manager-realtime";
            echoInstance.private(channel).listen(".ticket.created", (event) => {
                console.log("Received TicketCreated event:", event);
                setDashboardHeaderData((prevData) => ({
                    ...prevData,
                    total_ticket: event.total_ticket,
                    ticket_volume_growth: event.ticket_volume_growth,
                }));
            });
        },[user]);

    if(!dashboardHeaderData) {
        return null;
    }


    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                <CardDescription>
                    Total Tickets
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex flex-row gap-2 items-center">
                    <div className="bg-slate-700/10 size-12 rounded-md flex items-center justify-center">
                        <Ticket className="size-8" />
                    </div>
                    {Math.floor(dashboardHeaderData?.total_tickets?.value) || 0}<span className="font-thin text-sm">tickets</span>
                </CardTitle>
                <CardAction>
                    {
                        Math.floor(dashboardHeaderData.ticket_volume_growth?.value) !== 0 ?
                        <Badge variant="outline">
                        {
                            Math.floor(dashboardHeaderData.ticket_growth_direction?.value) === 1 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />
                        }
                        { Math.floor(dashboardHeaderData.ticket_growth_direction?.value) === 1 ? `+${Math.floor(dashboardHeaderData.ticket_volume_growth?.value)}%` : `-${Math.floor(dashboardHeaderData.ticket_volume_growth?.value)}%` }
                        </Badge> : null
                    }
                    {/* {dashboardHeaderData.ticket_volume_growth >= 0 ? `+${dashboardHeaderData.ticket_volume_growth}%` : `${dashboardHeaderData.ticket_volume_growth}%`} */}
                </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {/* {dashboardHeaderData.ticket_volume_growth >= 0 ? 'Increase' : 'Decrease'} of ticket volume growth {dashboardHeaderData.ticket_volume_growth >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />} */}
                        {Math.floor(dashboardHeaderData.ticket_growth_direction?.value) === 1 ? 'Increased' : (Math.floor(dashboardHeaderData.ticket_growth_direction?.value) === -1 ? 'Decreased' : 'Stable')} ticket volume growth {Math.floor(dashboardHeaderData.ticket_growth_direction?.value) === 1 ? <TrendingUp className="size-4" /> : (Math.floor(dashboardHeaderData.ticket_growth_direction?.value) === -1 ? <TrendingDown className="size-4" /> : null)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Data compared to the previous day, recorded {''} 
                        {dashboardHeaderData.total_tickets?.recorded 
                            ? formatDistanceToNow(new Date(dashboardHeaderData.total_tickets.recorded), { addSuffix: true }) 
                            : 'N/A'}
                        
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                <CardDescription>Service Satisfaction</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex flex-row gap-2 items-center">
                    <div className="bg-slate-700/10 size-12 rounded-md flex items-center justify-center">
                        <MonitorCog className="size-8" />
                    </div>
                    {Math.floor(dashboardHeaderData?.overall_satisfaction_rate?.value) || 0}<span className="font-thin text-sm">%</span>
                </CardTitle>
                <CardAction>
                    {
                        Math.floor(dashboardHeaderData.satisfaction_trend?.value) !== 0 ?
                        <Badge variant="outline">
                        {
                            Math.floor(dashboardHeaderData.satisfaction_trend_direction?.value) === 1 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />
                        }
                        { Math.floor(dashboardHeaderData.satisfaction_trend_direction?.value) === 1 ? `+${Math.floor(dashboardHeaderData.satisfaction_trend?.value)}%` : `-${Math.floor(dashboardHeaderData.satisfaction_trend?.value)}%` }
                        </Badge> : null
                    }
                </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {Math.floor(dashboardHeaderData.satisfaction_trend_direction?.value) === 1 ? 'Increased' : (Math.floor(dashboardHeaderData.satisfaction_trend_direction?.value) === -1 ? 'Decreased' : 'Stable')} satisfaction rate {Math.floor(dashboardHeaderData.satisfaction_trend_direction?.value) === 1 ? <TrendingUp className="size-4" /> : (Math.floor(dashboardHeaderData.satisfaction_trend_direction?.value) === -1 ? <TrendingDown className="size-4" /> : null)}

                </div>
                <div className="text-muted-foreground text-xs">
                    Data compared to the previous day, recorded {''} 
                    {dashboardHeaderData.overall_satisfaction_rate?.recorded 
                        ? formatDistanceToNow(new Date(dashboardHeaderData.overall_satisfaction_rate.recorded), { addSuffix: true }) 
                        : 'N/A'}      
                </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                <CardDescription>Backlog Activites</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex flex-row gap-2 items-center">
                    <div className="bg-slate-700/10 size-12 rounded-md flex items-center justify-center">
                        <ClockAlert className="size-8" />
                    </div>
                    {Math.floor(dashboardHeaderData?.backlog_rate?.value) || 0}<span className="font-thin text-sm">%</span>
                </CardTitle>
                <CardAction>
                    {
                        Math.floor(dashboardHeaderData.backlog_rate_trend?.value) !== 0 ?
                        <Badge variant="outline">
                        {
                            Math.floor(dashboardHeaderData.backlog_rate_trend_direction?.value) === 1 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />
                        }
                        { Math.floor(dashboardHeaderData.backlog_rate_trend_direction?.value) === 1 ? `+${Math.floor(dashboardHeaderData.backlog_rate_trend?.value)}%` : `-${Math.floor(dashboardHeaderData.backlog_rate_trend?.value)}%` }
                        </Badge> : null
                    }
                </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {Math.floor(dashboardHeaderData.backlog_rate_trend_direction?.value) === 1 ? 'Increased' : (Math.floor(dashboardHeaderData.backlog_rate_trend_direction?.value) === -1 ? 'Decreased' : 'Stable')} backlog rate {Math.floor(dashboardHeaderData.backlog_rate_trend_direction?.value) === 1 ? <TrendingUp className="size-4" /> : (Math.floor(dashboardHeaderData.backlog_rate_trend_direction?.value) === -1 ? <TrendingDown className="size-4" /> : null)}
                </div>
                <div className="text-muted-foreground text-xs">
                    Data compared to the previous day, recorded {''} 
                    {dashboardHeaderData.backlog_rate?.recorded 
                        ? formatDistanceToNow(new Date(dashboardHeaderData.backlog_rate.recorded), { addSuffix: true }) 
                        : 'N/A'}      
                </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                <CardDescription>Cancellation Percentage</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex flex-row gap-2 items-center">
                    <div className="bg-slate-700/10 size-12 rounded-md flex items-center justify-center">
                        <CircleMinus className="size-8" />
                    </div>
                    {Math.floor(dashboardHeaderData?.cancellation_rate?.value) || 0}<span className="font-thin text-sm">%</span>
                </CardTitle>
                <CardAction>
                    {
                        Math.floor(dashboardHeaderData.cancellation_rate_trend?.value) !== 0 ?
                        <Badge variant="outline">
                        {
                            Math.floor(dashboardHeaderData.cancellation_rate_trend_direction?.value) === 1 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />
                        }
                        { Math.floor(dashboardHeaderData.cancellation_rate_trend_direction?.value) === 1 ? `+${Math.floor(dashboardHeaderData.cancellation_rate_trend?.value)}%` : `-${Math.floor(dashboardHeaderData.cancellation_rate_trend?.value)}%` }
                        </Badge> : null
                    }
                </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {Math.floor(dashboardHeaderData.cancellation_rate_trend_direction?.value) === 1 ? 'Increased' : (Math.floor(dashboardHeaderData.cancellation_rate_trend_direction?.value) === -1 ? 'Decreased' : 'Stable')} cancellation rate {Math.floor(dashboardHeaderData.cancellation_rate_trend_direction?.value) === 1 ? <TrendingUp className="size-4" /> : (Math.floor(dashboardHeaderData.cancellation_rate_trend_direction?.value) === -1 ? <TrendingDown className="size-4" /> : null)}
                </div>
                <div className="text-muted-foreground text-xs">
                    Data compared to the previous day, recorded {''} 
                    {dashboardHeaderData.cancellation_rate?.recorded 
                        ? formatDistanceToNow(new Date(dashboardHeaderData.cancellation_rate.recorded), { addSuffix: true }) 
                        : 'N/A'}    
                </div>
                </CardFooter>
            </Card>
        </div>    
    )
}

export default DashboardHeader;
