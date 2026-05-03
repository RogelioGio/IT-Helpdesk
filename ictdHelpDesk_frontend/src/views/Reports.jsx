import CancellationReport from "@/components/Reports/CancellationReport";
import IncidentDensity from "@/components/Reports/IncidentDensity";
import ReportDialog from "@/components/Reports/ReportDialog";
import ServeiceStatisfaction from "@/components/Reports/ServiceStatisfaction";
import TicketSummary from "@/components/Reports/TIcketSummary";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportStore } from "@/stores/useReportStore";
import { format, set } from "date-fns";
import { CalendarIcon, ChevronDown, CircleMinus, ClipboardCopyIcon, LucideClipboardClock, Ticket, Wrench } from "lucide-react";
import { useEffect, useState } from "react";


export default function Reports() {
    const [report, setReport] = useState("ticketSummary");
    const [period, setPeriod] = useState("all");
    const {params, setParams, setContext} = useReportStore();
    const [open, setOpen] = useState(false);
    const tablist = [
        {
            icon: Ticket,
            reportName: "Ticket Volume",
            description: "View ticket volume statistics over a specified time period, including the breakdown of ticket categories, priorities, and sources. This report helps identify trends in ticket creation and can assist in resource allocation and workload management.",
            value: "ticketSummary",
            url: "api/gen/volume",
            content: <TicketSummary/>
        },
        {
            icon: Wrench,
            reportName: "Service Satisfaction",
            description: "Analyze customer satisfaction levels with the services provided by your support team. This report includes feedback, ratings, and insights to help improve service quality and user experience.",
            value: "service",
            url: "api/gen/service",
            content: <ServeiceStatisfaction/>
        },
        {
            icon: LucideClipboardClock,
            reportName: "Incident Density",
            description: "Analyze the frequency and distribution of incidents over a specified time period. This report helps identify patterns and hotspots for proactive management.",
            value: "incidentDensity",
            url: "api/gen/incident",
            content: <IncidentDensity/>
        },
        {
            icon: CircleMinus,
            reportName: "Cancellation Report",
            description: "Analyze the reasons and frequency of ticket cancellations over a specified time period. This report helps identify trends and areas for improvement in the cancellation process.",
            value: "cancellationRatio",
            url: "api/gen/cancellation",
            content: <CancellationReport/>
        }

    ]

    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    });

    useEffect(() => {
        setContext(tablist[0]);
        setParams({ period: "All Time", startDate: null, endDate: null });
    }, [])
    useEffect(() => {
        const staticParams = {...params}
        console.log("report changed", report, params);
        setParams({ period: staticParams.period, startDate: staticParams.startDate, endDate: staticParams.endDate });
    }, [report])

    const handleReportScopeChange = (value) => {
        switch(value) {
            case "7":
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 7)),
                    to: new Date(),
                })
                setParams({ period: "Last 7 Days" , startDate: new Date(new Date().setDate(new Date().getDate() - 7)), endDate: new Date()});
                break;
            case "30":
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 30)),
                    to: new Date(),
                })
                setParams({ period: "Last 30 Days", startDate: new Date(new Date().setDate(new Date().getDate() - 30)), endDate: new Date()});
                break;
            case "90":
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 90)),
                    to: new Date(),
                })
                setParams({ period: "Last 90 Days", startDate: new Date(new Date().setDate(new Date().getDate() - 90)), endDate: new Date() });
                break;
            case "180":
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 180)),
                    to: new Date(),
                })
                setParams({ period: "Last 180 Days", startDate: new Date(new Date().setDate(new Date().getDate() - 180)), endDate: new Date() });
                break;
            case "custom":
                setParams({ period: "Custom" });
                setDateRange({
                    from: null,
                    to: null,
                })
                break;
            case "all":
                setParams({ period: "All Time", startDate: null, endDate: null });
                setDateRange({
                    from: null,
                    to: null,
                })
                break;
        }
    }

    return (
        <>
            <Tabs value={report} onValueChange={setReport} className="w-full p-4 h-full flex flex-col">
           {/* Header */}
           <div className="flex flex-row items-center justify-between">
                <TabsList className="">
                    {
                        tablist.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <TabsTrigger key={tab.value} value={tab.value} onClick={() => setContext(tab)}>
                                    <div className="flex flex-row items-center gap-2">
                                        <Icon className="size-4"/>
                                        {tab.reportName}
                                    </div>
                                </TabsTrigger>
                            )})
                    }
                </TabsList>
                <div className="flex flex-row gap-4">
                    {
                        period === "custom" ? 
                        <div className="flex flex-col gap-2 w-full items-center">
                            <Popover className="w-full">
                                <PopoverTrigger className="w-full">
                                    <Button variant="outline" size="sm" className="w-full flex flex-row items-center justify-between text-sm py-4">
                                        <div className="gap-4 flex flex-row">
                                            <CalendarIcon />
                                            {
                                                dateRange?.from && dateRange?.to ?
                                                // `${format(reportDateRange.from)} - ${format(reportDateRange.to)}`
                                                `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                                                :
                                                "Select Date Range"
                                            }
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="range"
                                        defaultMonth= {dateRange?.from || new Date()}
                                        selected={dateRange}
                                        numberOfMonths={2}
                                        onSelect={(value) => {
                                            setParams({startDate: format(value?.from, "yyyy-MM-dd"), endDate: format(value?.to, "yyyy-MM-dd")});
                                            setDateRange({from: value?.from, to: value?.to})
                                        }}
                                        disabled = {(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>: null
                    }
                    <Select value={period} onValueChange={(value) => {setPeriod(value); handleReportScopeChange(value)}}>
                        <SelectTrigger className="w-max-content">
                            <SelectValue placeholder="Select Report Scope" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                            <SelectItem value="90">Last 90 Days</SelectItem>
                            <SelectItem value="180">Last 6 Months</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setOpen(true)}>
                        <ClipboardCopyIcon className="size-4" data-icon="inline-start"/>
                        Export Report
                    </Button>
                </div>
            </div>
            {
                tablist.map((tab) => {
                    return (
                        <TabsContent key={tab.value} value={tab.value} className="flex flex-col pt-4 flex-1 min-h-0">
                            {tab.content}
                        </TabsContent>
                    )})
            }
        </Tabs>
        <ReportDialog open={open} setOpen={setOpen}/>
        </>
        // Content
    );
}
