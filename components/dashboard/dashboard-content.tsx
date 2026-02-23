"use client"

import { useEffect, useState } from "react"
import { StatCard } from "./stat-card"
import { StatsOverview } from "./stats-overview"
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
import {
  axisGridPreset,
  barStartEdgeRadius,
  chartMotionDefaults,
  safeSeriesBorderStyle,
  tooltipMarkerLabelValue,
} from "@/lib/chart-options"

const emptyMetrics = {
  totalCustomers: 0,
  uniqueCountries: 0,
  uniqueCompanies: 0,
  avgPerMonth: 0,
  growthRate: 0,
  lastMonthCount: 0,
}

export function DashboardContent() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    fetch("/customers-1000.csv")
      .then(res => res.text())
      .then(csvContent => {
        const parsed = parseCustomerCSV(csvContent)
        setCustomers(parsed)
      })
      .catch(err => {
        console.error("Failed to load customer data:", err)
      })
  }, [])

  const hasData = customers.length > 0
  const metrics = hasData ? calculateGrowthMetrics(customers) : emptyMetrics
  const topCountries = hasData ? getTopCountries(customers, 8) : []
  const rankedCountries = topCountries.filter(country => country.name !== "Others")
  const monthlyData = hasData ? getMonthlySubscriptions(customers) : []
  const topCompanies = hasData ? getTopCompanies(customers, 8) : []
  const yearlyData = hasData ? getSubscriptionsByYear(customers) : []
  const quarterlyData = hasData ? getQuarterlyStats(customers) : []
  const continentData = hasData ? getCustomersByContinent(customers) : []
  const domainData = hasData ? getDomainDistribution(customers) : []
  const horizontalBarGrid = axisGridPreset({ horizontalBar: true })

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* KPI Cards */}
      <StatsOverview>
        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers}
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
      </StatsOverview>

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
              ...chartMotionDefaults,
              tooltip: {
                trigger: "item",
                formatter: params => {
                  const item = Array.isArray(params) ? params[0] : params
                  const value =
                    typeof item?.value === "number" || typeof item?.value === "string"
                      ? item.value
                      : 0
                  const percent =
                    typeof item?.percent === "number"
                      ? item.percent
                      : Number(item?.percent ?? 0)

                  return tooltipMarkerLabelValue(
                    item,
                    String(item?.name ?? "Unknown"),
                    value,
                    ` (${percent}%)`
                  )
                },
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
                    ...safeSeriesBorderStyle(2),
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
                ...horizontalBarGrid.xAxis,
              },
              yAxis: {
                type: "category",
                data: rankedCountries.map(d => d.name).reverse(),
                ...horizontalBarGrid.yAxis,
                axisLabel: {
                  width: 80,
                  overflow: "truncate",
                },
              },
              series: [
                {
                  name: "Customers",
                  type: "bar",
                  data: rankedCountries.map(d => d.value).reverse(),
                  itemStyle: {
                    borderRadius: barStartEdgeRadius("horizontal", 4),
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
                    borderRadius: barStartEdgeRadius("vertical", 4),
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
                ...horizontalBarGrid.xAxis,
              },
              yAxis: {
                type: "category",
                data: topCompanies.map(d => d.name).reverse(),
                ...horizontalBarGrid.yAxis,
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
                    borderRadius: barStartEdgeRadius("horizontal", 4),
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
                  max: Math.max(...domainData.map(x => x.count), 1) * 1.2,
                })),
                shape: "polygon",
              },
              series: [
                {
                  name: "Domains",
                  type: "radar",
                  data: domainData.length > 0
                    ? [{
                        value: domainData.map(d => d.count),
                        name: "Count",
                        areaStyle: { opacity: 0.3 },
                      }]
                    : [],
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
                formatter: params => {
                  const item = Array.isArray(params) ? params[0] : params
                  const value =
                    typeof item?.value === "number" || typeof item?.value === "string"
                      ? item.value
                      : 0

                  return tooltipMarkerLabelValue(
                    item,
                    String(item?.name ?? "Unknown"),
                    value
                  )
                },
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
                formatter: params => {
                  const item = Array.isArray(params) ? params[0] : params
                  const value =
                    typeof item?.value === "number" || typeof item?.value === "string"
                      ? item.value
                      : 0

                  return tooltipMarkerLabelValue(
                    item,
                    String(item?.name ?? "Unknown"),
                    value,
                    " customers"
                  )
                },
              },
              series: [
                {
                  name: "Countries",
                  type: "treemap",
                  top: 4,
                  left: 4,
                  right: 4,
                  bottom: 4,
                  roam: false,
                  nodeClick: false,
                  breadcrumb: {
                    show: false,
                  },
                  label: {
                    show: true,
                    formatter: "{b}",
                  },
                  data: rankedCountries.slice(0, 10).map(d => ({
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

                  const item = params
                  const [monthIndex, count, year] = params.data
                  const monthNumber = typeof monthIndex === "number" ? monthIndex : Number(monthIndex)
                  if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) {
                    return tooltipMarkerLabelValue(
                      item,
                      String(year),
                      String(count),
                      " customers"
                    )
                  }

                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                  return tooltipMarkerLabelValue(
                    item,
                    `${months[monthNumber - 1]} ${year}`,
                    String(count),
                    " customers"
                  )
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
