import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { CircleMinus, Percent } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const HeaderGraph = ({data}) => {
    const {cancellation_data, cancellation_data_summary} = data || {};

    return (
        <div className="w-fulll border rounded-md flex flex-col overflow-hidden">
             <div className="p-4 bg-accent/10 border-b">
                <div className="flex flex-row gap-2 items-center">
                    <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center ">
                        <CircleMinus />
                    </div>
                    <div>
                        <p className="font-bold">Cancellation Trend</p>
                        <p className="text-xs text-slate-500"> Cancellation trend base on the cancelled ticket monthly</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 flex-1 ">
                {
                    cancellation_data ? 
                    <ChartContainer className="col-span-3 aspect-video w-full flex-1 pb-4 px-6 max-h-80 border-r" config={chartConfig}>
                        <AreaChart data={cancellation_data} margin={{ top: 40, right: 20, left: 20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="cancelled_tickets" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                    offset="5%"
                                    stopColor="var(--color-cancelled_tickets)"
                                    stopOpacity={0.8}
                                    />
                                    <stop
                                    offset="95%"
                                    stopColor="var(--color-cancelled_tickets)"
                                    stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return format(date, "MMM")
                                }}
                                />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        return format(date, "MMMM")
                                    }}
                                    indicator="dot"
                                    />
                                }
                                />
                            <Area dataKey="cancelled_tickets" stroke="var(--color-cancelled_tickets)" fill="url(#cancelled_tickets)" type="natural" />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                    : null
                }
                <div className="flex flex-col">
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <p className="font-medium">Total Cancelled Tickets</p>
                            <p className="text-xs text-slate-500">This is the accumulated number of cancelled tickets.</p>
                        </div>
                        <div className="flex-1 flex flex-row gap-2 items-center">
                            <div className="size-14 rounded-md bg-red-200/40 flex items-center justify-center ">
                                <CircleMinus className="size-7 text-red-500"/>
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{cancellation_data_summary?.total_cancelled || 0} Tickets</p>
                                <p className="text-xs text-slate-500">This is the accumulated number of cancelled tickets.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between border-t">
                        <div>
                            <p className="font-medium">Cancellation Percentage</p>
                            <p className="text-xs text-slate-500">Percentage on how a ticket can be cancellable</p>
                        </div>
                        <div className="flex-1 flex flex-row gap-2 items-center">
                            <div className="size-14 rounded-md bg-red-200/40 flex items-center justify-center ">
                                <Percent className="size-7 text-red-500"/>
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{cancellation_data_summary?.cancellation_percent?.toFixed(2) || 0}%</p>
                                <p className="text-xs text-slate-500">Possibility of a ticket being cancelled.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderGraph;

const chartConfig = {
    cancelled_tickets: {
        label: "Cancelled Tickets",
        color: "var(--chart-1)",
    },
}


const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]