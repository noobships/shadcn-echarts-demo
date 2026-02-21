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
import {
  chartMotionDefaults,
  demoBlueScale,
  safeGaugeStyle,
} from "@/lib/chart-options"

export default function TrendsPage() {
  const { customers } = useCustomerData()

  const hasData = customers.length > 0
  const metrics = hasData ? calculateGrowthMetrics(customers) : { totalCustomers: 0, uniqueCountries: 0, uniqueCompanies: 0, avgPerMonth: 0, growthRate: 0, lastMonthCount: 0 }
  const monthlyData = hasData ? getMonthlySubscriptions(customers) : []
  const yearlyData = hasData ? getSubscriptionsByYear(customers) : []

  // Calculate moving averages
  const movingAvg3 = monthlyData.length > 0
    ? monthlyData.map((_, idx, arr) => {
        if (idx < 2) return null
        return Math.round((arr[idx].count + arr[idx - 1].count + arr[idx - 2].count) / 3)
      })
    : []

  // Calculate growth rate for gauge
  const growthRate = Math.min(Math.max(metrics.growthRate + 50, 0), 100)
  const yoyGrowth = yearlyData.length >= 2
    ? ((yearlyData[yearlyData.length - 1].count - yearlyData[yearlyData.length - 2].count) / Math.max(yearlyData[yearlyData.length - 2].count, 1) * 100)
    : 0
  const gaugeBase = safeGaugeStyle()
  const monthlyTarget = Math.max(metrics.avgPerMonth, 1)
  const monthlyTargetMax = Math.max(Math.ceil(monthlyTarget * 1.5), monthlyTarget + 5)

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
                ...chartMotionDefaults,
                series: [
                  {
                    ...gaugeBase,
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    splitNumber: 5,
                    radius: "100%",
                    center: ["50%", "70%"],
                    progress: { show: false },
                    axisLine: {
                      ...gaugeBase.axisLine,
                      lineStyle: {
                        width: 16,
                        color: [
                          [0.3, demoBlueScale[0]],
                          [0.7, demoBlueScale[1]],
                          [1, demoBlueScale[2]],
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
                      ...gaugeBase.detail,
                      formatter: "{value}%",
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
                ...chartMotionDefaults,
                series: [
                  {
                    ...gaugeBase,
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    min: -50,
                    max: 50,
                    radius: "100%",
                    center: ["50%", "70%"],
                    progress: { show: false },
                    axisLine: {
                      ...gaugeBase.axisLine,
                      lineStyle: {
                        width: 16,
                        color: [
                          [0.4, demoBlueScale[0]],
                          [0.6, demoBlueScale[1]],
                          [1, demoBlueScale[2]],
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
                      ...gaugeBase.detail,
                      formatter: (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`,
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
                ...chartMotionDefaults,
                series: [
                  {
                    ...gaugeBase,
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: monthlyTargetMax,
                    radius: "100%",
                    center: ["50%", "70%"],
                    progress: {
                      ...gaugeBase.progress,
                      show: true,
                      width: 16,
                      itemStyle: {
                        color: demoBlueScale[1],
                      },
                    },
                    axisLine: {
                      ...gaugeBase.axisLine,
                      lineStyle: { width: 16 },
                    },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    pointer: { show: false },
                    title: {
                      show: true,
                      offsetCenter: [0, "40%"],
                      fontSize: 13,
                    },
                    detail: {
                      ...gaugeBase.detail,
                      formatter: (value: number) => `${Math.round(value)} / ${monthlyTarget}`,
                      fontSize: 21,
                      offsetCenter: [0, "18%"],
                    },
                    data: [{ value: Math.min(metrics.lastMonthCount, monthlyTargetMax), name: "Customers this month" }],
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
