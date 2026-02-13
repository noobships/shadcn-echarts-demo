"use client"

import { useEffect, useState } from "react"
import { StatCard } from "./stat-card"
import { ChartCard } from "./chart-card"
import { AreaChartComponent } from "@/components/area-chart"
import { BarChartComponent } from "@/components/bar-chart"
import { PieChartComponent } from "@/components/pie-chart"
import { LineChartComponent } from "@/components/line-chart"
import { RadarChartComponent } from "@/components/radar-chart"
import { FunnelChartComponent } from "@/components/funnel-chart"
import { TreemapChartComponent } from "@/components/treemap-chart"
import { ScatterChartComponent } from "@/components/scatter-chart"
import {
  UsersIcon,
  GlobeIcon,
  BuildingIcon,
  TrendingUpIcon,
} from "lucide-react"
import {
  parseCustomerCSV,
  getTopCountries,
  getMonthlySubscriptions,
  getTopCompanies,
  getSubscriptionsByYear,
  getQuarterlyStats,
  getCustomersByContinent,
  getDomainDistribution,
  calculateGrowthMetrics,
  type Customer,
} from "@/lib/customer-data"

export function DashboardContent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch CSV data
    fetch("/customers-1000.csv")
      .then(res => res.text())
      .then(csvContent => {
        const parsed = parseCustomerCSV(csvContent)
        setCustomers(parsed)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to load customer data:", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading || customers.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 h-80 animate-pulse rounded-xl bg-muted/50" />
          <div className="col-span-3 h-80 animate-pulse rounded-xl bg-muted/50" />
        </div>
      </div>
    )
  }

  const metrics = calculateGrowthMetrics(customers)
  const topCountries = getTopCountries(customers, 8)
  const monthlyData = getMonthlySubscriptions(customers)
  const topCompanies = getTopCompanies(customers, 8)
  const yearlyData = getSubscriptionsByYear(customers)
  const quarterlyData = getQuarterlyStats(customers)
  const continentData = getCustomersByContinent(customers)
  const domainData = getDomainDistribution(customers)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers.toLocaleString()}
          trend={metrics.growthRate}
          trendLabel="from last month"
          icon={<UsersIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Countries"
          value={metrics.uniqueCountries}
          description="Active regions worldwide"
          icon={<GlobeIcon className="h-5 w-5" />}
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
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Customer Growth Chart - Area */}
        <ChartCard
          title="Customer Growth"
          description="Cumulative customer acquisition over time"
          className="lg:col-span-4"
        >
          <AreaChartComponent
            height={320}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "cross" },
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
                  name: "Cumulative",
                  type: "line",
                  smooth: true,
                  areaStyle: {
                    opacity: 0.3,
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

        {/* Geographic Distribution - Pie */}
        <ChartCard
          title="Geographic Distribution"
          description="Customers by continent"
          className="lg:col-span-3"
        >
          <PieChartComponent
            height={320}
            option={{
              tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)",
              },
              legend: {
                orient: "vertical",
                right: 10,
                top: "center",
              },
              series: [
                {
                  name: "Continent",
                  type: "pie",
                  radius: ["40%", "70%"],
                  center: ["40%", "50%"],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 8,
                    borderColor: "var(--background)",
                    borderWidth: 2,
                  },
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  },
                  data: continentData.map(d => ({
                    name: d.name,
                    value: d.value,
                  })),
                },
              ],
            }}
          />
        </ChartCard>
      </div>

      {/* Second Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Countries Bar Chart */}
        <ChartCard
          title="Top Countries"
          description="Customer count by country"
        >
          <BarChartComponent
            height={280}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
              },
              xAxis: {
                type: "value",
              },
              yAxis: {
                type: "category",
                data: topCountries.map(d => d.name).reverse(),
                axisLabel: {
                  width: 80,
                  overflow: "truncate",
                },
              },
              series: [
                {
                  name: "Customers",
                  type: "bar",
                  data: topCountries.map(d => d.value).reverse(),
                  itemStyle: {
                    borderRadius: [0, 4, 4, 0],
                  },
                },
              ],
            }}
          />
        </ChartCard>

        {/* Monthly Subscriptions Line Chart */}
        <ChartCard
          title="Monthly Subscriptions"
          description="New customers by month"
        >
          <LineChartComponent
            height={280}
            option={{
              tooltip: {
                trigger: "axis",
              },
              xAxis: {
                type: "category",
                data: monthlyData.map(d => d.month),
                axisLabel: {
                  rotate: 45,
                },
              },
              yAxis: {
                type: "value",
                name: "New",
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

        {/* Yearly Comparison */}
        <ChartCard
          title="Yearly Comparison"
          description="Subscriptions by year"
        >
          <BarChartComponent
            height={280}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
              },
              xAxis: {
                type: "category",
                data: yearlyData.map(d => d.year),
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "Customers",
                  type: "bar",
                  data: yearlyData.map(d => d.count),
                  itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.2)",
                    },
                  },
                },
              ],
            }}
          />
        </ChartCard>
      </div>

      {/* Third Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Companies */}
        <ChartCard
          title="Top Companies"
          description="Companies with most customers"
        >
          <BarChartComponent
            height={280}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
              },
              xAxis: {
                type: "value",
              },
              yAxis: {
                type: "category",
                data: topCompanies.map(d => d.name).reverse(),
                axisLabel: {
                  width: 100,
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

        {/* Domain Distribution Radar */}
        <ChartCard
          title="Website Domains"
          description="Top-level domain distribution"
        >
          <RadarChartComponent
            height={280}
            option={{
              tooltip: {
                trigger: "item",
              },
              radar: {
                indicator: domainData.map(d => ({
                  name: `.${d.domain}`,
                  max: Math.max(...domainData.map(x => x.count)) * 1.2,
                })),
                shape: "polygon",
              },
              series: [
                {
                  name: "Domains",
                  type: "radar",
                  data: [
                    {
                      value: domainData.map(d => d.count),
                      name: "Count",
                      areaStyle: {
                        opacity: 0.3,
                      },
                    },
                  ],
                },
              ],
            }}
          />
        </ChartCard>

        {/* Quarterly Funnel */}
        <ChartCard
          title="Quarterly Trend"
          description="Subscription funnel by quarter"
        >
          <FunnelChartComponent
            height={280}
            option={{
              tooltip: {
                trigger: "item",
                formatter: "{b}: {c}",
              },
              series: [
                {
                  name: "Quarters",
                  type: "funnel",
                  left: "10%",
                  width: "80%",
                  minSize: "30%",
                  maxSize: "100%",
                  sort: "none",
                  gap: 4,
                  label: {
                    show: true,
                    position: "inside",
                  },
                  itemStyle: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                  data: quarterlyData.slice(-6).map(d => ({
                    name: d.quarter,
                    value: d.count,
                  })),
                },
              ],
            }}
          />
        </ChartCard>
      </div>

      {/* Bottom Row - Full width charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Treemap - Countries */}
        <ChartCard
          title="Country Treemap"
          description="Visual representation of customer distribution"
        >
          <TreemapChartComponent
            height={300}
            option={{
              tooltip: {
                formatter: "{b}: {c} customers",
              },
              series: [
                {
                  name: "Countries",
                  type: "treemap",
                  roam: false,
                  nodeClick: false,
                  breadcrumb: {
                    show: false,
                  },
                  label: {
                    show: true,
                    formatter: "{b}",
                  },
                  itemStyle: {
                    borderRadius: 4,
                    borderWidth: 2,
                    gapWidth: 2,
                  },
                  levels: [
                    {
                      itemStyle: {
                        borderWidth: 0,
                        gapWidth: 4,
                      },
                    },
                  ],
                  data: topCountries.slice(0, 12).map(d => ({
                    name: d.name,
                    value: d.value,
                  })),
                },
              ],
            }}
          />
        </ChartCard>

        {/* Scatter Plot - Subscription Timeline */}
        <ChartCard
          title="Subscription Timeline"
          description="Scatter view of monthly signups by year"
        >
          <ScatterChartComponent
            height={300}
            option={{
              tooltip: {
                trigger: "item",
                formatter: params => {
                  if (Array.isArray(params) || !Array.isArray(params.data)) {
                    return ""
                  }

                  const [monthIndex, count, year] = params.data
                  const monthNumber = typeof monthIndex === "number" ? monthIndex : Number(monthIndex)
                  if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) {
                    return `${year}: ${count} customers`
                  }

                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                  return `${months[monthNumber - 1]} ${year}: ${count} customers`
                },
              },
              xAxis: {
                type: "category",
                name: "Month",
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              },
              yAxis: {
                type: "value",
                name: "Count",
              },
              series: yearlyData.map(year => ({
                name: year.year,
                type: "scatter" as const,
                symbolSize: (val: number[]) => Math.max(val[1] * 2, 10),
                data: monthlyData
                  .filter(m => m.month.includes(year.year.slice(2)))
                  .map(m => {
                    const monthNum = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                      .indexOf(m.month.split(" ")[0]) + 1
                    return [monthNum, m.count, year.year]
                  }),
              })),
            }}
          />
        </ChartCard>
      </div>
    </div>
  )
}
