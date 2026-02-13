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
import { StatCard } from "@/components/dashboard/stat-card"
import { UsersIcon, BuildingIcon, TrendingUpIcon, CalendarIcon } from "lucide-react"

export default function CustomersPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Customers"
          breadcrumbs={[{ label: "Customers" }]}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>
      </>
    )
  }

  const metrics = calculateGrowthMetrics(customers)
  const topCompanies = getTopCompanies(customers, 15)
  const monthlyData = getMonthlySubscriptions(customers)

  // Create scatter data for company size distribution
  const companyScatterData = topCompanies.map((company, idx) => [
    idx + 1,
    company.count,
    company.name,
  ])

  return (
    <>
      <PageHeader
        title="Customers"
        breadcrumbs={[{ label: "Customers" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Customers"
            value={metrics.totalCustomers.toLocaleString()}
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
        </div>

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
                },
                yAxis: {
                  type: "category",
                  data: topCompanies.map(d => d.name).reverse(),
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
                      borderRadius: [0, 4, 4, 0],
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
                  formatter: (params: { data: (string | number)[] }) => {
                    return `${params.data[2]}: ${params.data[1]} customers`
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
