import { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { format, set } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useUserStore } from "@/stores/userUserStore";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { useTicketStore } from "@/stores/useTicketStore";
import { date } from "yup";
import { CalendarIcon, ChevronDown, Circle, CircleChevronDown, CircleDot, CircleEqual, ClipboardCheck, ClipboardEdit, Flame, LayoutList, MessageCircleQuestionMark, OctagonAlert, SquareMenu, UserCog, Wrench } from "lucide-react";

const Priority = [
    {
        id: "all",
        name: "All Priorities",
        icon: SquareMenu
    },
    {
        id: 1,
        name: "Critical",
        icon: Flame
    },
    {
        id: 2,
        name: "High",
        icon: OctagonAlert
    },
    {
        id: 3,
        name: "Medium",
        icon: CircleEqual
    },
    {
        id: 4,
        name: "Low",
        icon: CircleChevronDown
    },
    {
        id: 5,
        name: "No Priority",
        icon: Circle
    }
]

const Status = [
    {
        id: "all",
        name: "All Statuses",
        icon: SquareMenu
    },
    {
        id: 1,
        name: "Open",
        icon: MessageCircleQuestionMark
    },
    {
        id: 2,
        name: "Assigned",
        icon: UserCog
    },
    {
        id: 3,
        name: "Responded",
        icon: Wrench
    },
    {
        id: 4,
        name: "Resolved",
        icon: ClipboardCheck
    },
    {
        id: 5,
        name: "Closed",
        icon: CircleDot
    }
]



const TicketMasterListReportDialog = ({ open, onOpenChange, act, actspec }) => {
    
    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    });
    const [reportScope, setReportScope] = useState("all");
    const [period, setPeriod] = useState("");
    const {params} = useTicketStore()

    const handleReportScopeChange = (value) => {
        switch(value) {
            case "7":
                // setParams({ reportScope: "Last 7 Days" });
                setPeriod("Last 7 Days");
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 7)),
                    to: new Date(),
                })
                break;
            case "30":
                // setParams({ reportScope: "Last 30 Days" });
                setPeriod("Last 30 Days");
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 30)),
                    to: new Date(),
                })
                break;
            case "90":
                // setParams({ reportScope: "Last 90 Days" });
                setPeriod("Last 90 Days");
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 90)),
                    to: new Date(),
                })
                break;
            case "180":
                //setParams({ reportScope: "Last 180 Days" });
                setPeriod("Last 180 Days");
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 180)),
                    to: new Date(),
                })
                break;
            case "custom":
                // setParams({ reportScope: "Custom" });
                setPeriod("Custom");
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 30)),
                    to: new Date(),
                })
                break;
            case "all":
                // setParams({ reportScope: "" });
                setPeriod("All Time");
                setDateRange({
                    from: null,
                    to: null,
                })
                break;
        }
    }
    useEffect(() => {
        handleReportScopeChange(reportScope);
    }, [reportScope])


    const handleExportReport = () => {
        const req = axiosClient.post('api/gen/ticket', {
            activity_id : params.activity_id !== "all" ? params.activity_id : "",
            activitySpecification_id : params.activitySpecification_id !== "all" ? params.activitySpecification_id : "",
            priority_id : params.priority_id !== "all" ? params.priority_id : "",
            status_id : params.status_id !== "all" ? params.status_id : "",
            period: period,
            startDate: reportScope !== "all" ? format(dateRange.from, "yyyy-MM-dd") : "",
            endDate: reportScope !== "all" ? format(dateRange.to, "yyyy-MM-dd") : ""
        }, { 
            responseType: 'blob' 
        });

        toast.promise(req, {
            loading: "Generating report...",
            success: (res) => {
                const file = new Blob([res.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                window.open(fileURL, '_blank');
                return "Report generated successfully.";
            },
            error: "Failed to generate report."
        })
    }

    const PriorityIcon = Priority.find(p => p.id === params.priority_id)?.icon || SquareMenu;
    const StatusIcon = Status.find(s => s.id == params.status_id)?.icon || SquareMenu;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Export Ticket Master List</DialogTitle>
                    <DialogDescription>
                        Generate and export the Ticket Master List report based on selected parameters.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <p className="font-medium text-sm py-2">Report Parameters</p>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row gap-10 w-full">
                            <div className="flex flex-row gap-4 items-center">
                                <div className="size-12 bg-gray-500/10 rounded-md flex items-center justify-center">
                                    <ClipboardEdit/>
                                </div>
                                <div>
                                    <p className="font-medium">{params.activity_id !== "all" ? act.find(a => a.id == params.activity_id)?.name : "All Activities"}</p>
                                    <p className="text-xs text-slate-500">Activity</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="size-12 bg-gray-500/10 rounded-md flex items-center justify-center">
                                    <LayoutList className="size-6" />
                                </div>
                                <div>
                                    <p className="font-medium">{params.activitySpecification_id !== "all" ? actspec.find(a => a.id == params.activitySpecification_id)?.name : "All Activities Specification"}</p>
                                    <p className="text-xs text-slate-500">Activity Specification</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="size-12 bg-gray-500/10 rounded-md flex items-center justify-center">
                                    <PriorityIcon className="size-6" />
                                </div>
                                <div>
                                    <p className="font-medium">{Priority.find(p => p.id == params.priority_id)?.name || "All Priorities"}</p>
                                    <p className="text-xs text-slate-500">Ticket Priority</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="size-12 bg-gray-500/10 rounded-md flex items-center justify-center">
                                    <StatusIcon className="size-6" />
                                </div>
                                <div>
                                    <p className="font-medium">{Status.find(s => s.id == params.status_id)?.name || "All Statuses"}</p>
                                    <p className="text-xs text-slate-500">Ticket Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-xs">Select Report Scope</p>    
                            <Select defaultValue="all" onValueChange={setReportScope}>
                                <SelectTrigger className="w-sm  px-4 py-5">
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
                        </div>  
                        {
                            reportScope === "custom" ? 
                            <div className="flex flex-col gap-2 w-full ">
                                <p className="text-xs font-medium">Custom Report Scope</p>
                                <Popover className="w-full">
                                    <PopoverTrigger className="w-full">
                                        <Button variant="outline" size="lg" className="w-full flex flex-row items-center justify-between">
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
                                            onSelect={setDateRange}
                                            disabled = {(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div> : null
                            }
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                    <DialogClose asChild>
                        <Button variant="outline" size="lg">Cancel</Button>
                    </DialogClose>
                    <Button variant="default" size="lg" className="" onClick={() => {handleExportReport()}}>Generate Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default TicketMasterListReportDialog