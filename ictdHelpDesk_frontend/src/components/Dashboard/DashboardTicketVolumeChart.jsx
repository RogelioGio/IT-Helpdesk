import { Ticket } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format } from "date-fns";

const DashboardTicketVolumeChart = () => {
    const ticketData = [
        {date: "2024-01-01", count: 10},
        {date: "2024-01-02", count: 15},
        {date: "2024-01-03", count: 8},
        {date: "2024-01-04", count: 12},
        {date: "2024-01-05", count: 20},
        {date: "2024-01-06", count: 18},
        {date: "2024-01-07", count: 25},
        {date: "2024-01-08", count: 22},
        {date: "2024-01-09", count: 30},
        {date: "2024-01-10", count: 28},
        {date: "2024-01-11", count: 35},
        {date: "2024-01-12", count: 32},
        {date: "2024-01-13", count: 40},
        {date: "2024-01-14", count: 38},
        {date: "2024-01-15", count: 45},
        {date: "2024-01-16", count: 42},
    ]
    const chartConfig = {
        count: {
            label: "Total Tickets",
            color: "#64748b",
            // icon: Ticket
        }
    }
    return (
    <div className="border border-slate-200 bg-slate-200/10 rounded-md h-100 overflow-hidden md:col-span-2 col-span-1 flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex flex-row items-center gap-2">
            <div className="bg-slate-700/10 size-10 rounded-md flex items-center justify-center">
                <Ticket className="size-5" />
            </div>
            <div >
                <p className="font-bold">Ticket Volume</p>
                <p className="text-xs text-slate-500">Number of ticket being created daily</p>
            </div>
        </div>
        <ChartContainer className="w-full flex-1 pb-4 px-6 min-h-0" config={chartConfig}>
            <AreaChart
              data={ticketData}
            >
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.1}
                />
            </linearGradient>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return format(date, "MMM d")
              }}
            />
            <ChartTooltip cursor={false} content={
                <ChartTooltipContent labelFormatter={(value) => format(value, "MMM d YYY")} indicator="dot"/>
            } />
              <Area
                dataKey="count"
                type="natural"
                stackId="a"
                stroke="var(--color-count)"
                fill="url(#fill)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
        </ChartContainer>
    </div>
    )
}
export default DashboardTicketVolumeChart;