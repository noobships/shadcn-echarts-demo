"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { BarChartComponent } from "@/components/bar-chart"
import { ScatterChartComponent } from "@/components/scatter-chart"
import { LineChartComponent } from "@/components/line-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getTopCompanies,
  getMonthlySubscriptions,
  calculateGrowthMetrics,
} from "@/lib/customer-data"
import {
  axisGridPreset,
  barStartEdgeRadius,
  tooltipMarkerLabelValue,
} from "@/lib/chart-options"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { UsersIcon, BuildingIcon, TrendingUpIcon, CalendarIcon } from "lucide-react"

export default function CustomersPage() {
  const { customers } = useCustomerData()

  const hasData = customers.length > 0
  const metrics = hasData ? calculateGrowthMetrics(customers) : { totalCustomers: 0, uniqueCountries: 0, uniqueCompanies: 0, avgPerMonth: 0, growthRate: 0, lastMonthCount: 0 }
  const topCompanies = hasData ? getTopCompanies(customers, 15) : []
  const monthlyData = hasData ? getMonthlySubscriptions(customers) : []

  // Create scatter data for company size distribution
  const companyScatterData = topCompanies.map((company, idx) => [
    idx + 1,
    company.count,
    company.name,
  ])
  const horizontalBarGrid = axisGridPreset({ horizontalBar: true })

  return (
    <>
      <PageHeader
        title="Customers"
        breadcrumbs={[{ label: "Customers" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Stats */}
        <StatsOverview>
          <StatCard
            title="Total Customers"
            value={metrics.totalCustomers}
            trend={metrics.growthRate}
            trendLabel="from last month"
            icon={<UsersIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Companies"
            value={metrics.uniqueCompanies}
            description="Unique organizations"
            icon={<BuildingIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Avg. Monthly"
            value={metrics.avgPerMonth}
            description="New customers per month"
            icon={<TrendingUpIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Last Month"
            value={metrics.lastMonthCount}
            description="New signups"
            icon={<CalendarIcon className="h-5 w-5" />}
          />
        </StatsOverview>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Top Companies"
            description="Organizations with most customers"
            className="lg:col-span-1"
          >
            <BarChartComponent
              height={400}
              option={{
                tooltip: {
                  trigger: "axis",
                  axisPointer: { type: "shadow" },
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "3%",
                  containLabel: true,
                },
                xAxis: {
                  type: "value",
                  ...horizontalBarGrid.xAxis,
                },
                yAxis: {
                  type: "category",
                  data: topCompanies.map(d => d.name).reverse(),
                  ...horizontalBarGrid.yAxis,
                  axisLabel: {
                    width: 120,
                    overflow: "truncate",
                  },
                },
                series: [
                  {
                    name: "Customers",
                    type: "bar",
                    data: topCompanies.map(d => d.count).reverse(),
                    itemStyle: {
                      borderRadius: barStartEdgeRadius("horizontal", 4),
                    },
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard
            title="Company Size Distribution"
            description="Scatter plot of customer counts per company"
          >
            <ScatterChartComponent
              height={400}
              option={{
                tooltip: {
                  trigger: "item",
                  formatter: params => {
                    const item = Array.isArray(params) ? params[0] : params
                    const values = Array.isArray(item?.data) ? item.data : []
                    const label = String(values[2] ?? item?.name ?? "Unknown")
                    const count =
                      typeof values[1] === "number" || typeof values[1] === "string"
                        ? values[1]
                        : 0

                    return tooltipMarkerLabelValue(item, label, count, " customers")
                  },
                },
                xAxis: {
                  type: "value",
                  name: "Rank",
                  nameLocation: "middle",
                  nameGap: 30,
                },
                yAxis: {
                  type: "value",
                  name: "Customers",
                },
                series: [
                  {
                    name: "Companies",
                    type: "scatter",
                    symbolSize: (val: number[]) => Math.max(val[1] * 5, 15),
                    data: companyScatterData,
                    emphasis: {
                      focus: "self",
                    },
                  },
                ],
              }}
            />
          </ChartCard>
        </div>

        {/* Full width chart */}
        <ChartCard
          title="Customer Acquisition Timeline"
          description="Monthly new customer signups over time"
        >
          <LineChartComponent
            height={350}
            option={{
              tooltip: {
                trigger: "axis",
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              xAxis: {
                type: "category",
                data: monthlyData.map(d => d.month),
                boundaryGap: false,
              },
              yAxis: {
                type: "value",
                name: "New Customers",
              },
              series: [
                {
                  name: "New Customers",
                  type: "line",
                  smooth: true,
                  data: monthlyData.map(d => d.count),
                  markPoint: {
                    data: [
                      { type: "max", name: "Max" },
                      { type: "min", name: "Min" },
                    ],
                  },
                  markLine: {
                    data: [{ type: "average", name: "Avg" }],
                  },
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </>
  )
}
