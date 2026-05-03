import { CircleMinus, ClipboardMinus, Scroll } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const DashboardTopCancellationReasons = () => {
    const data = [
        { reason: "Customer Request", count: 15 },
        { reason: "Duplicate Ticket", count: 10 },
        { reason: "Issue Resolved", count: 8 },
        { reason: "Incorrect Ticket", count: 5 },
        { reason: "Other", count: 3 },
        { reason: "No Response", count: 2 },
        { reason: "Resolved Externally", count: 1 },
        { reason: "Out of Scope", count: 1 },
    ]; // Replace with actual data fetching logic]

    return (
        <div className="border border-slate-200 bg-slate-200/10 rounded-md h-full xl:h-100 overflow-hidden md:col-span-2 col-span-1 flex flex-col">
            <div className="p-4 px-6 border-b border-slate-200 flex flex-row items-center gap-2">
                <div className="bg-slate-700/10 size-10 rounded-md flex items-center justify-center">
                    <CircleMinus className="size-5" />
                </div>
                <div >
                    <p className="font-bold">Top Cancellation Reasons</p>
                    <p className="text-xs text-slate-500">Most common reasons for ticket cancellations</p>
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
                                    <p className="text-sm font-medium">{item.reason}</p>
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
};

export default DashboardTopCancellationReasons;