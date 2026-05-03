import { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { CalendarIcon, ChevronDown, ClipboardEdit, Contact, MonitorCog, ShieldUser, User, Users, Wrench } from "lucide-react";
import { format, set } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useUserStore } from "@/stores/userUserStore";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";


const UserMasterlistReportDialog = ({open, onOpenChange, dept}) => {
    const [reportScope, setReportScope] = useState("all");
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().getFullYear(), 0, 12),
        to: new Date(new Date().getFullYear(), 0, 12),
    });
    const {params, setParams} = useUserStore()

    const handleReportScopeChange = (value) => {
        switch(value) {
            case "7":
                setParams({ reportScope: "Last 7 Days" });
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 7)),
                    to: new Date(),
                })
                break;
            case "30":
                setParams({ reportScope: "Last 30 Days" });
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 30)),
                    to: new Date(),
                })
                break;
            case "90":
                setParams({ reportScope: "Last 90 Days" });
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 90)),
                    to: new Date(),
                })
                break;
            case "180":
                setParams({ reportScope: "Last 180 Days" });
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 180)),
                    to: new Date(),
                })
                break;
            case "custom":
                setParams({ reportScope: "Custom" });
                setDateRange({
                    from: new Date(new Date().setDate(new Date().getDate() - 30)),
                    to: new Date(),
                })
                break;
            case "all":
                setParams({ reportScope: "" });
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

    const Icon = AccountRolesStyle[params.account_role_id]?.icon || Contact; 

    const handleExportReport = () => {
        const req = axiosClient.post('api/gen/user', {
            office_department_division_id: params.office_department_division_id !== "all" ? params.office_department_division_id : "",
            account_role_id: params.account_role_id !== "all" ? params.account_role_id : "",
            period: params.reportScope,
            startDate: params.reportScope !== "" ? format(dateRange.from, "yyyy-MM-dd") : "",
            endDate: params.reportScope !== "" ? format(dateRange.to, "yyyy-MM-dd") : ""
        }, { 
            responseType: 'blob' 
        });

        toast.promise(req, {
            loading: "Generating report...",
            success: (res) => {
                const file = new Blob([res.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                window.open(fileURL, '_blank');
                onOpenChange(false);
                return "Report generated successfully.";
            },
            error: "Failed to generate report."
        })
    }

    useEffect(() => {setReportScope("all")}, [open])
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Export User Masterlist</DialogTitle>
                    <DialogDescription>
                        This file will contain all user information, including names, email addresses, roles, and other relevant details. You can use this file for reporting, analysis, or backup purposes.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <p className="font-medium text-sm py-2">Report Parameters</p>
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div className="flex flex-row gap-6">
                                <div className="flex flex-row gap-4 items-center">
                                    <div className="size-12 bg-gray-500/10 rounded-md flex items-center justify-center">
                                        <ClipboardEdit/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{dept.find((d) => d.id === params.office_department_division_id)?.name || "All Office/Department/Division"}</p>
                                        <p className="text-xs text-slate-500">Office/Department/Division</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4 items-center">
                                    <div className="size-12 bg-gray-500/10 rounded-md flex items-center justify-center">
                                        <Icon className="size-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{AccountRolesStyle[params.account_role_id]?.text || "All Account Roles"}</p>
                                        <p className="text-xs text-slate-500">Account Roles</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <p className="text-xs">Select Report Scope</p>    
                                <Select defaultValue="all" onValueChange={setReportScope}>
                                    <SelectTrigger className="w-sm">
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
                        </div>
                        {
                            reportScope === "custom" ? 
                            <div className="flex flex-col gap-2 ">
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

const AccountRolesStyle = {
    "": {
        icon: Contact,
        text: "All Users",
        value: "all"
    },
    2: {
        icon: ShieldUser,
        text: "Administrators",
        value: 2
    },
    3: {
        icon: MonitorCog,
        text: "Managers",
        value: 3
    },
    4: {
        icon: Wrench,
        text: "Officers",
        value: 4
    },
    5: {
        icon: User,
        text: "Users",
        value: 5
    }
}

export default UserMasterlistReportDialog;
