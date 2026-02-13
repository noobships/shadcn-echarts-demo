"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { LineChartComponent } from "@/components/line-chart"
import { ComboChartComponent } from "@/components/combo-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getMonthlySubscriptions,
  getQuarterlyStats,
} from "@/lib/customer-data"
import { StatCard } from "@/components/dashboard/stat-card"
import { TrendingUpIcon, ActivityIcon, BarChart2Icon, LineChartIcon } from "lucide-react"

export default function AnalyticsPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Analytics"
          breadcrumbs={[{ label: "Analytics" }]}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>
      </>
    )
  }

  const monthlyData = getMonthlySubscriptions(customers)
  const quarterlyData = getQuarterlyStats(customers)

  // Calculate trend metrics
  const lastThreeMonths = monthlyData.slice(-3)
  const prevThreeMonths = monthlyData.slice(-6, -3)
  const recentAvg = lastThreeMonths.reduce((sum, m) => sum + m.count, 0) / 3
  const prevAvg = prevThreeMonths.reduce((sum, m) => sum + m.count, 0) / 3
  const trendPercent = prevAvg > 0 ? ((recentAvg - prevAvg) / prevAvg * 100).toFixed(1) : 0

  const maxMonth = monthlyData.reduce((max, m) => m.count > max.count ? m : max, monthlyData[0])
  const minMonth = monthlyData.reduce((min, m) => m.count < min.count ? m : min, monthlyData[0])

  return (
    <>
      <PageHeader
        title="Analytics"
        breadcrumbs={[{ label: "Analytics" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="3-Month Trend"
            value={`${trendPercent}%`}
            trend={parseFloat(String(trendPercent))}
            description="vs previous quarter"
            icon={<TrendingUpIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Peak Month"
            value={maxMonth?.month || "N/A"}
            description={`${maxMonth?.count || 0} signups`}
            icon={<ActivityIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Lowest Month"
            value={minMonth?.month || "N/A"}
            description={`${minMonth?.count || 0} signups`}
            icon={<BarChart2Icon className="h-5 w-5" />}
          />
          <StatCard
            title="Monthly Average"
            value={Math.round(monthlyData.reduce((sum, m) => sum + m.count, 0) / monthlyData.length)}
            description="customers per month"
            icon={<LineChartIcon className="h-5 w-5" />}
          />
        </div>

        {/* Main trend chart */}
        <ChartCard
          title="Customer Growth Trend"
          description="Cumulative customer acquisition over time"
        >
          <ComboChartComponent
            height={350}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "cross" },
              },
              legend: {
                data: ["Cumulative", "Monthly"],
                top: 0,
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                top: "15%",
                containLabel: true,
              },
              xAxis: {
                type: "category",
                data: monthlyData.map(d => d.month),
                boundaryGap: false,
              },
              yAxis: [
                {
                  type: "value",
                  name: "Cumulative",
                  position: "left",
                },
                {
                  type: "value",
                  name: "Monthly",
                  position: "right",
                },
              ],
              series: [
                {
                  name: "Cumulative",
                  type: "line",
                  smooth: true,
                  yAxisIndex: 0,
                  areaStyle: {
                    opacity: 0.3,
                  },
                  data: monthlyData.map(d => d.cumulative),
                },
                {
                  name: "Monthly",
                  type: "bar",
                  yAxisIndex: 1,
                  data: monthlyData.map(d => d.count),
                  itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                  },
                },
              ],
            }}
          />
        </ChartCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Monthly Trend Analysis"
            description="New customer signups with trend indicators"
          >
            <LineChartComponent
              height={300}
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
                },
                series: [
                  {
                    name: "Monthly",
                    type: "line",
                    smooth: true,
                    data: monthlyData.map(d => d.count),
                    markPoint: {
                      data: [
                        { type: "max", name: "Peak" },
                        { type: "min", name: "Low" },
                      ],
                    },
                    markLine: {
                      data: [
                        { type: "average", name: "Average" },
                      ],
                    },
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard
            title="Quarterly Performance"
            description="Customer acquisition by quarter"
          >
            <LineChartComponent
              height={300}
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
                  data: quarterlyData.map(d => d.quarter),
                },
                yAxis: {
                  type: "value",
                },
                series: [
                  {
                    name: "Quarterly",
                    type: "line",
                    smooth: true,
                    data: quarterlyData.map(d => d.count),
                    areaStyle: {
                      opacity: 0.2,
                    },
                    markArea: {
                      silent: true,
                      data: [
                        [
                          { xAxis: quarterlyData.length - 2 },
                          { xAxis: quarterlyData.length - 1 },
                        ],
                      ],
                    },
                  },
                ],
              }}
            />
          </ChartCard>
        </div>
      </div>
    </>
  )
}
