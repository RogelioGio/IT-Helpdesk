import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutList, PieChart, Wrench } from "lucide-react";
import { FileBadge, Handshake, MessageCircleHeart, MousePointerClick, Shield, UserCog } from "lucide-react";
import { useState } from "react";


const ContentList = ({ data }) => {
    const {ActivitySatisfactionBreakDown, ActivitySpecificationSatisfactionBreakDown, DepartmentSatisfactionBreakDown} = data;

    const [datasets, setDatasets] = useState(ActivitySatisfactionBreakDown);
    const [category, setCategory] = useState("activities");
    const handleSelectChange = (value) => {
        switch (value) {
            case "activities":
                setDatasets(ActivitySatisfactionBreakDown);
                break;
            case "activity-specifications":
                setDatasets(ActivitySpecificationSatisfactionBreakDown);
                break;
            case "departments":
                setDatasets(DepartmentSatisfactionBreakDown);
                break;
        }
    }



    return (
        <div className="w-full border rounded-md flex flex-col min-h-0">
            <div className="p-4 bg-accent/10 border-b flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                        <LayoutList />
                    </div>
                    <div>
                        <p className="font-bold">Service Satisfaction breakdown</p>
                        <p className="text-xs text-slate-500">Breakdown with the given activities, specifications and departments</p>
                    </div>
                </div>
                <Select value={category} onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-80">
                        <SelectValue placeholder="Select a report" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                <SelectItem value="activities">Ticket Activities</SelectItem>
                                <SelectItem value="activity-specifications">Ticket Activities Specifications</SelectItem>
                                <SelectItem value="departments">Office/Department/Division</SelectItem>
                            </SelectGroup>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <ScrollArea className="h-125">
                {
                    datasets.map((item, index) => (                        
                        <div className="border-b last:border-b-0" key={index}>
                            <div className="flex justify-between items-center p-4">
                                <div>
                                    <p className="font-bold">{item.label} </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-xs">Overall Satisfaction</p>
                                    <div className="flex flex-row items-center justify-center gap-3">
                                        <p className="text-2xl font-bold">{item.rating}</p>
                                        <div className="size-9 bg-slate-500/10 rounded-md flex items-center justify-center">
                                            <PieChart className="size-5"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 border-t">
                                {
                                    item.breakdown.map((dimension, index) => {
                                        const dimensionInfo = DimensionStyling.find((item) => item.label === dimension.label);
                                        return (
                                            <div key={index} className="flex flex-col gap-2 p-4 border-r last:border-r-0">
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-xs">{dimension.label}</p>
                                                    <dimensionInfo.icon className="size-4 text-slate-500"/>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold">{dimension.rating} <span className="text-xs text-slate-500 font-normal">/ 5.0</span></p>
                                                    <p className="text-xs text-slate-500">Average Rating</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </ScrollArea>
        </div>
    )
}

export default ContentList;


const ticketActivitiesData = [
    {
        label: "Ticket Activities-1",
        rating: 4.5,
        description: "Description for Ticket Activities-1",
        breakdown: [
            { label: "Responsiveness", rating: 4.5 },
            { label: "Reliability", rating: 4.0 },
            { label: "Communication", rating: 4.8 },
            { label: "Integrity", rating: 4.5 },
            { label: "Assurance", rating: 4.5 },
            { label: "Outcome", rating: 4.5 }
        ]
    },
    {
        label: "Ticket Activities-2",
        rating: 3.9,
        description: "Description for Ticket Activities-2",
        breakdown: [
            { label: "Responsiveness", rating: 4.0 },
            { label: "Reliability", rating: 3.8 },
            { label: "Communication", rating: 4.2 },
            { label: "Integrity", rating: 3.5 },
            { label: "Assurance", rating: 3.9 },
            { label: "Outcome", rating: 4.0 }
        ]
    },
    {
        label: "Ticket Activities-3",
        rating: 4.7,
        description: "Description for Ticket Activities-3",
        breakdown: [
            { label: "Responsiveness", rating: 4.9 },
            { label: "Reliability", rating: 4.6 },
            { label: "Communication", rating: 4.8 },
            { label: "Integrity", rating: 4.7 },
            { label: "Assurance", rating: 4.6 },
            { label: "Outcome", rating: 4.8 }
        ]
    },
    {
        label: "Ticket Activities-4",
        rating: 3.5,
        description: "Description for Ticket Activities-4",
        breakdown: [
            { label: "Responsiveness", rating: 3.6 },
            { label: "Reliability", rating: 3.2 },
            { label: "Communication", rating: 3.8 },
            { label: "Integrity", rating: 3.4 },
            { label: "Assurance", rating: 3.5 },
            { label: "Outcome", rating: 3.6 }
        ]
    },
    {
        label: "Ticket Activities-5",
        rating: 4.2,
        description: "Description for Ticket Activities-5",
        breakdown: [
            { label: "Responsiveness", rating: 4.3 },
            { label: "Reliability", rating: 4.1 },
            { label: "Communication", rating: 4.4 },
            { label: "Integrity", rating: 4.0 },
            { label: "Assurance", rating: 4.2 },
            { label: "Outcome", rating: 4.3 }
        ]
    },
    {
        label: "Ticket Activities-6",
        rating: 2.9,
        description: "Description for Ticket Activities-6",
        breakdown: [
            { label: "Responsiveness", rating: 3.0 },
            { label: "Reliability", rating: 2.8 },
            { label: "Communication", rating: 3.1 },
            { label: "Integrity", rating: 2.7 },
            { label: "Assurance", rating: 2.9 },
            { label: "Outcome", rating: 3.0 }
        ]
    },
    {
        label: "Ticket Activities-7",
        rating: 4.8,
        description: "Description for Ticket Activities-7",
        breakdown: [
            { label: "Responsiveness", rating: 5.0 },
            { label: "Reliability", rating: 4.7 },
            { label: "Communication", rating: 4.9 },
            { label: "Integrity", rating: 4.8 },
            { label: "Assurance", rating: 4.7 },
            { label: "Outcome", rating: 4.9 }
        ]
    },
    {
        label: "Ticket Activities-8",
        rating: 3.2,
        description: "Description for Ticket Activities-8",
        breakdown: [
            { label: "Responsiveness", rating: 3.3 },
            { label: "Reliability", rating: 3.0 },
            { label: "Communication", rating: 3.4 },
            { label: "Integrity", rating: 3.1 },
            { label: "Assurance", rating: 3.2 },
            { label: "Outcome", rating: 3.3 }
        ]
    }
];

const activitiesSpecificationsData = [
    {
        label: "Ticket Activities Specifications-1",
        rating: 4.5,
        description: "Description for Ticket Activities Specifications-1"
    },
    {
        label: "Ticket Activities Specifications-2",
        rating: 4.0,
        description: "Description for Ticket Activities Specifications-2"
    },
    {
        label: "Ticket Activities Specifications-3",
        rating: 4.8,
        description: "Description for Ticket Activities Specifications-3"
    },
    {
        label: "Ticket Activities Specifications-1",
        rating: 4.5,
        description: "Description for Ticket Activities Specifications-1"
    },
    {
        label: "Ticket Activities Specifications-1",
        rating: 4.5,
        description: "Description for Ticket Activities Specifications-1"
    }
]

const officeDepartmentDivisionData = [
    {
        label: "Office/Department/Division-1",
        officeCode: "ODD-001",
        rating: 4.5,
        description: "Description for Office/Department/Division-1"
    },
    {
        label: "Office/Department/Division-2",
        officeCode: "ODD-002",
        rating: 4.0,
        description: "Description for Office/Department/Division-2"
    }
]

const DimensionStyling = [
    {
        label: "Responsiveness",
        icon: UserCog
    },
    {
        label: "Reliability",
        icon: MousePointerClick
    },
    {
        label: "Communication",
        icon: MessageCircleHeart
    },
    {
        label: "Integrity",
        icon: Shield
    },
    {
        label: "Assurance",
        icon: Handshake
    },
    {
        label: "Outcome",
        icon: FileBadge
    }
]