import { ClipboardMinusIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const DashboardTopDepartmentCancellations = () => {
    const data = [
        { department: "IT Support", count: 20 },
        { department: "Customer Service", count: 15 },
        { department: "Billing", count: 10 },
        { department: "Technical Support", count: 8 },
        { department: "Sales", count: 5 },
        { department: "HR", count: 3 },
        { department: "Marketing", count: 2 },
        { department: "Operations", count: 1 },
    ]; // Replace with actual data fetching logic

    return (
        <div className="border border-slate-200 bg-slate-200/10 rounded-md h-full xl:h-100 overflow-hidden md:col-span-2 col-span-1 flex flex-col">
            <div className="p-4 px-6 border-b border-slate-200 flex flex-row items-center gap-2">
                <div className="bg-slate-700/10 size-10 rounded-md flex items-center justify-center">
                    <ClipboardMinusIcon className="size-5" />
                </div>
                <div >
                    <p className="font-bold">Top Department Cancellations</p>
                    <p className="text-xs text-slate-500">List of departments with the most ticket cancellations</p>
                </div>
            </div>
            <ScrollArea className="h-full">
                {
                    data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between px-6 py-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="bg-slate-700/10 size-12 rounded-md flex items-center justify-center">
                                    <p className="font-extrabold m-0 text-xl">{index + 1}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{item.department}</p>
                                    <p className="text-xs text-slate-500">Cancelled Tickets: {item.count}</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-10">
                                <div>
                                    <p className="text-xs text-slate-500">Cancelation Percentage:</p>
                                    <p className="text-sm font-bold">10% <span className="font-light text-xs">of total tickets</span></p>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </ScrollArea>
        </div>
    )
}

export default DashboardTopDepartmentCancellations;