"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { LineChartComponent } from "@/components/line-chart"
import { AreaChartComponent } from "@/components/area-chart"
import { GaugeChartComponent } from "@/components/gauge-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getMonthlySubscriptions,
  getSubscriptionsByYear,
  calculateGrowthMetrics,
} from "@/lib/customer-data"

export default function TrendsPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Trend Analysis"
          breadcrumbs={[{ label: "Trend Analysis" }]}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>
      </>
    )
  }

  const metrics = calculateGrowthMetrics(customers)
  const monthlyData = getMonthlySubscriptions(customers)
  const yearlyData = getSubscriptionsByYear(customers)

  // Calculate moving averages
  const movingAvg3 = monthlyData.map((_, idx, arr) => {
    if (idx < 2) return null
    return Math.round((arr[idx].count + arr[idx - 1].count + arr[idx - 2].count) / 3)
  })

  // Calculate growth rate for gauge
  const growthRate = Math.min(Math.max(metrics.growthRate + 50, 0), 100) // Normalize to 0-100

  // Calculate year-over-year growth
  const yoyGrowth = yearlyData.length >= 2
    ? ((yearlyData[yearlyData.length - 1].count - yearlyData[yearlyData.length - 2].count) / yearlyData[yearlyData.length - 2].count * 100)
    : 0

  return (
    <>
      <PageHeader
        title="Trend Analysis"
        breadcrumbs={[{ label: "Trend Analysis" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Gauges */}
        <div className="grid gap-4 md:grid-cols-3">
          <ChartCard
            title="Growth Momentum"
            description="Current growth indicator"
          >
            <GaugeChartComponent
              height={220}
              option={{
                series: [
                  {
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    splitNumber: 5,
                    radius: "100%",
                    center: ["50%", "70%"],
                    axisLine: {
                      lineStyle: {
                        width: 20,
                        color: [
                          [0.3, "var(--chart-5)"],
                          [0.7, "var(--chart-3)"],
                          [1, "var(--chart-1)"],
                        ],
                      },
                    },
                    pointer: {
                      itemStyle: {
                        color: "auto",
                      },
                    },
                    axisTick: {
                      show: false,
                    },
                    splitLine: {
                      show: false,
                    },
                    axisLabel: {
                      show: false,
                    },
                    title: {
                      show: false,
                    },
                    detail: {
                      valueAnimation: true,
                      formatter: "{value}%",
                      fontSize: 20,
                      offsetCenter: [0, "20%"],
                    },
                    data: [{ value: Math.round(growthRate) }],
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard
            title="YoY Growth"
            description="Year-over-year change"
          >
            <GaugeChartComponent
              height={220}
              option={{
                series: [
                  {
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    min: -50,
                    max: 50,
                    radius: "100%",
                    center: ["50%", "70%"],
                    axisLine: {
                      lineStyle: {
                        width: 20,
                        color: [
                          [0.4, "var(--chart-5)"],
                          [0.6, "var(--chart-3)"],
                          [1, "var(--chart-1)"],
                        ],
                      },
                    },
                    pointer: {
                      itemStyle: {
                        color: "auto",
                      },
                    },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    detail: {
                      valueAnimation: true,
                      formatter: (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`,
                      fontSize: 20,
                      offsetCenter: [0, "20%"],
                    },
                    data: [{ value: yoyGrowth }],
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard
            title="Monthly Target"
            description="Progress to monthly goal"
          >
            <GaugeChartComponent
              height={220}
              option={{
                series: [
                  {
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: metrics.avgPerMonth * 1.5,
                    radius: "100%",
                    center: ["50%", "70%"],
                    progress: {
                      show: true,
                      width: 20,
                    },
                    axisLine: {
                      lineStyle: {
                        width: 20,
                      },
                    },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    pointer: { show: false },
                    detail: {
                      valueAnimation: true,
                      formatter: "{value}",
                      fontSize: 24,
                      offsetCenter: [0, "20%"],
                    },
                    data: [{ value: metrics.lastMonthCount }],
                  },
                ],
              }}
            />
          </ChartCard>
        </div>

        {/* Main trend chart with moving average */}
        <ChartCard
          title="Trend with Moving Average"
          description="Monthly subscriptions with 3-month moving average"
        >
          <LineChartComponent
            height={350}
            option={{
              tooltip: {
                trigger: "axis",
              },
              legend: {
                data: ["Monthly", "3-Month MA"],
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
              yAxis: {
                type: "value",
                name: "Customers",
              },
              series: [
                {
                  name: "Monthly",
                  type: "line",
                  data: monthlyData.map(d => d.count),
                  smooth: false,
                  symbol: "circle",
                  symbolSize: 6,
                },
                {
                  name: "3-Month MA",
                  type: "line",
                  data: movingAvg3,
                  smooth: true,
                  lineStyle: {
                    width: 3,
                    type: "dashed",
                  },
                  symbol: "none",
                },
              ],
            }}
          />
        </ChartCard>

        {/* Stacked area for cumulative */}
        <ChartCard
          title="Cumulative Growth"
          description="Total customer base over time"
        >
          <AreaChartComponent
            height={300}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "cross" },
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
                name: "Total Customers",
              },
              series: [
                {
                  name: "Cumulative",
                  type: "line",
                  smooth: true,
                  areaStyle: {
                    opacity: 0.4,
                  },
                  emphasis: {
                    focus: "series",
                  },
                  data: monthlyData.map(d => d.cumulative),
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </>
  )
}
