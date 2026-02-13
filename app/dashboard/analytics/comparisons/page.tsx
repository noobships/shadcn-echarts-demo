"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { BarChartComponent } from "@/components/bar-chart"
import { BoxplotChartComponent } from "@/components/boxplot-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getMonthlySubscriptions,
  getSubscriptionsByYear,
  getQuarterlyStats,
} from "@/lib/customer-data"

export default function ComparisonsPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Comparisons"
          breadcrumbs={[
            { label: "Analytics", href: "/dashboard/analytics" },
            { label: "Comparisons" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>
      </>
    )
  }

  const monthlyData = getMonthlySubscriptions(customers)
  const yearlyData = getSubscriptionsByYear(customers)
  const quarterlyData = getQuarterlyStats(customers)

  // Group monthly data by year for comparison
  const yearlyMonthlyData: Record<string, number[]> = {}
  monthlyData.forEach(m => {
    const year = "20" + m.month.split(" ")[1]
    if (!yearlyMonthlyData[year]) {
      yearlyMonthlyData[year] = []
    }
    yearlyMonthlyData[year].push(m.count)
  })

  // Create boxplot data - [min, Q1, median, Q3, max]
  const boxplotData = Object.entries(yearlyMonthlyData).map(([year, values]) => {
    const sorted = [...values].sort((a, b) => a - b)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
    const q1Idx = Math.floor(sorted.length / 4)
    const q3Idx = Math.floor(3 * sorted.length / 4)
    const q1 = sorted[q1Idx]
    const q3 = sorted[q3Idx]
    return { year, data: [min, q1, median, q3, max] }
  })

  return (
    <>
      <PageHeader
        title="Comparisons"
        breadcrumbs={[
          { label: "Analytics", href: "/dashboard/analytics" },
          { label: "Comparisons" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Year over year comparison */}
        <ChartCard
          title="Year-over-Year Comparison"
          description="Monthly performance compared across years"
        >
          <BarChartComponent
            height={380}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
              },
              legend: {
                data: Object.keys(yearlyMonthlyData),
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
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              },
              yAxis: {
                type: "value",
                name: "Customers",
              },
              series: Object.entries(yearlyMonthlyData).map(([year, values]) => ({
                name: year,
                type: "bar",
                data: values,
                itemStyle: {
                  borderRadius: [4, 4, 0, 0],
                },
              })),
            }}
          />
        </ChartCard>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Boxplot for yearly distribution */}
          <ChartCard
            title="Yearly Distribution"
            description="Statistical distribution of monthly signups by year"
          >
            <BoxplotChartComponent
              height={350}
              option={{
                tooltip: {
                  trigger: "item",
                  formatter: params => {
                    const item = Array.isArray(params) ? params[0] : params
                    const values = Array.isArray(item?.data)
                      ? item.data.map(value => (typeof value === "number" ? value : Number(value)))
                      : []
                    const [min, q1, median, q3, max] =
                      values.length >= 5 ? values.slice(-5) : [0, 0, 0, 0, 0]

                    return `${String(item?.name ?? "")}<br/>
                      Min: ${min}<br/>
                      Q1: ${q1}<br/>
                      Median: ${median}<br/>
                      Q3: ${q3}<br/>
                      Max: ${max}`
                  },
                },
                grid: {
                  left: "10%",
                  right: "10%",
                  bottom: "15%",
                },
                xAxis: {
                  type: "category",
                  data: boxplotData.map(d => d.year),
                  boundaryGap: true,
                },
                yAxis: {
                  type: "value",
                  name: "Customers",
                },
                series: [
                  {
                    name: "Distribution",
                    type: "boxplot",
                    data: boxplotData.map(d => d.data),
                    itemStyle: {
                      borderWidth: 2,
                    },
                  },
                ],
              }}
            />
          </ChartCard>

          {/* Quarterly stacked comparison */}
          <ChartCard
            title="Quarterly Breakdown"
            description="Quarter-by-quarter performance"
          >
            <BarChartComponent
              height={350}
              option={{
                tooltip: {
                  trigger: "axis",
                  axisPointer: { type: "shadow" },
                },
                legend: {
                  data: yearlyData.map(y => y.year),
                  bottom: 0,
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "15%",
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  data: ["Q1", "Q2", "Q3", "Q4"],
                },
                yAxis: {
                  type: "value",
                },
                series: yearlyData.map(year => {
                  const yearQuarters = quarterlyData.filter(q => q.quarter.includes(year.year))
                  return {
                    name: year.year,
                    type: "bar",
                    stack: "total",
                    data: yearQuarters.map(q => q.count),
                    emphasis: {
                      focus: "series",
                    },
                  }
                }),
              }}
            />
          </ChartCard>
        </div>

        {/* Yearly totals */}
        <ChartCard
          title="Annual Performance"
          description="Total customer acquisition by year"
        >
          <BarChartComponent
            height={300}
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
                type: "category",
                data: yearlyData.map(d => d.year),
              },
              yAxis: {
                type: "value",
                name: "Total Customers",
              },
              series: [
                {
                  name: "Customers",
                  type: "bar",
                  data: yearlyData.map(d => d.count),
                  itemStyle: {
                    borderRadius: [8, 8, 0, 0],
                  },
                  label: {
                    show: true,
                    position: "top",
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowColor: "rgba(0,0,0,0.3)",
                    },
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
