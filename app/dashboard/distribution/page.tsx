"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { BarChartComponent } from "@/components/bar-chart"
import { HeatmapChartComponent } from "@/components/heatmap-chart"
import { ScatterChartComponent } from "@/components/scatter-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getMonthlySubscriptions,
  getSubscriptionsByYear,
  getTopCountries,
  getDomainDistribution,
} from "@/lib/customer-data"
import {
  barStartEdgeRadius,
  chartMotionDefaults,
  demoBlueScale,
  safeHeatmapEmphasis,
  tooltipMarkerLabelValue,
} from "@/lib/chart-options"

export default function DistributionPage() {
  const { customers } = useCustomerData()

  const hasData = customers.length > 0
  const monthlyData = hasData ? getMonthlySubscriptions(customers) : []
  const yearlyData = hasData ? getSubscriptionsByYear(customers) : []
  const topCountries = hasData ? getTopCountries(customers, 10) : []
  const domainData = hasData ? getDomainDistribution(customers) : []

  // Create heatmap data: [month, year, value]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const years = yearlyData.map(y => y.year)
  
  const heatmapData: [number, number, number][] = []
  monthlyData.forEach(m => {
    const [mon, yr] = m.month.split(" ")
    const monthIdx = months.indexOf(mon)
    const yearIdx = years.indexOf("20" + yr)
    if (monthIdx >= 0 && yearIdx >= 0) {
      heatmapData.push([monthIdx, yearIdx, m.count])
    }
  })

  // Create histogram data for subscription frequency
  const countBuckets = [0, 0, 0, 0, 0] // 0-20, 21-40, 41-60, 61-80, 81+
  monthlyData.forEach(m => {
    if (m.count <= 20) countBuckets[0]++
    else if (m.count <= 40) countBuckets[1]++
    else if (m.count <= 60) countBuckets[2]++
    else if (m.count <= 80) countBuckets[3]++
    else countBuckets[4]++
  })

  return (
    <>
      <PageHeader
        title="Distribution Charts"
        breadcrumbs={[{ label: "Distribution Charts" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Heatmap */}
        <ChartCard
          title="Monthly Signup Heatmap"
          description="Subscription intensity by month and year"
        >
          <HeatmapChartComponent
            height={250}
            option={{
              ...chartMotionDefaults,
              tooltip: {
                position: "top",
                formatter: params => {
                  const item = Array.isArray(params) ? params[0] : params
                  const values = Array.isArray(item?.data)
                    ? item.data.map(value => (typeof value === "number" ? value : Number(value)))
                    : []
                  const [monthIndex, yearIndex, count] =
                    values.length >= 3 ? values : [0, 0, 0]

                  return tooltipMarkerLabelValue(
                    item,
                    `${months[monthIndex]} ${years[yearIndex]}`,
                    count,
                    " customers"
                  )
                },
              },
              grid: {
                left: "15%",
                right: "10%",
                bottom: "15%",
                top: "5%",
              },
              xAxis: {
                type: "category",
                data: months,
                splitArea: { show: true },
              },
              yAxis: {
                type: "category",
                data: years,
                splitArea: { show: true },
              },
              visualMap: {
                min: 0,
                max: Math.max(...monthlyData.map(m => m.count), 1),
                calculable: true,
                orient: "horizontal",
                left: "center",
                bottom: "0%",
                inRange: {
                  color: [...demoBlueScale],
                },
              },
              series: [
                {
                  name: "Signups",
                  type: "heatmap",
                  data: heatmapData,
                  itemStyle: {
                    borderWidth: 0,
                    borderColor: "transparent",
                    borderRadius: 2,
                  },
                  label: {
                    show: false,
                  },
                  emphasis: safeHeatmapEmphasis(),
                },
              ],
            }}
          />
        </ChartCard>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Histogram */}
          <ChartCard
            title="Monthly Signup Distribution"
            description="Histogram of monthly signup volumes"
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
                  data: ["0-20", "21-40", "41-60", "61-80", "81+"],
                  name: "Signup Range",
                },
                yAxis: {
                  type: "value",
                  name: "# of Months",
                },
                series: [
                  {
                    name: "Frequency",
                    type: "bar",
                    data: countBuckets,
                    itemStyle: {
                      borderRadius: barStartEdgeRadius("vertical", 4),
                    },
                    barWidth: "60%",
                  },
                ],
              }}
            />
          </ChartCard>

          {/* Domain distribution */}
          <ChartCard
            title="Website Domain Distribution"
            description="Top-level domain breakdown"
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
                  data: domainData.map(d => `.${d.domain}`),
                },
                yAxis: {
                  type: "value",
                  name: "Count",
                },
                series: [
                  {
                    name: "Domains",
                    type: "bar",
                    data: domainData.map(d => d.count),
                    itemStyle: {
                      borderRadius: barStartEdgeRadius("vertical", 4),
                    },
                  },
                ],
              }}
            />
          </ChartCard>
        </div>

        {/* Scatter distribution */}
        <ChartCard
          title="Country vs Signup Volume"
          description="Scatter plot of country distribution"
        >
          <ScatterChartComponent
            height={350}
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
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
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
                  name: "Countries",
                  type: "scatter",
                  symbolSize: (val: number[]) => Math.max(Math.sqrt(val[1]) * 5, 10),
                  data: topCountries.map((c, idx) => [idx + 1, c.value, c.name]),
                  emphasis: {
                    focus: "self",
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
