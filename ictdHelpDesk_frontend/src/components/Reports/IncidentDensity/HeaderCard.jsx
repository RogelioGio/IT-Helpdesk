import { ClipboardClockIcon } from "lucide-react";
import { useEffect } from "react";


const HeaderCard = ({ data }) => {
    const {activities} = data;
    return (
        <div className="w-fulll border rounded-md">
           <div className="p-4 bg-accent/10 border-b">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                        <ClipboardClockIcon />
                    </div>
                    <div>
                        <p className="font-bold">Incident Density Breakdown</p>
                        <p className="text-xs text-slate-500">Overall Incident Density breakdown based on activity</p>
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-4`}>
                {
                    activities ? 
                    activities.map((item, index) => {
                        const totalItems = activities.length;
                        const lastRowStartIndex = Math.floor((totalItems - 1) / 4) * 4;
                        const isLastRow = index >= lastRowStartIndex;
                        const isRightEdge = (index + 1) % 4 === 0 || index === totalItems - 1;
                        
                        return (
                            <div className={`
                                    p-4 flex flex-col gap-2
                                    ${isRightEdge ? "" : "border-r"} 
                                    ${isLastRow ? "" : "border-b"}
                                `} key={index}>
                                <div className="flex flex-row justify-between">
                                    <p className="text-sm ">{item.label}</p>
                                </div>
                                <p className="font-bold text-2xl">{item.count} Ticket</p>
                            </div>
                        )
                    }) : null 
                }
            </div>
        </div>
    )
};

export default HeaderCard;