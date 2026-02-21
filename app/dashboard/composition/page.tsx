"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { PieChartComponent } from "@/components/pie-chart"
import { TreemapChartComponent } from "@/components/treemap-chart"
import { SankeyChartComponent } from "@/components/sankey-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getTopCountries,
  getCustomersByContinent,
  getSubscriptionsByYear,
  getDomainDistribution,
} from "@/lib/customer-data"
import {
  chartMotionDefaults,
  safeSeriesBorderStyle,
  tooltipMarkerLabelValue,
} from "@/lib/chart-options"

export default function CompositionPage() {
  const { customers } = useCustomerData()

  const hasData = customers.length > 0
  const topCountries = hasData ? getTopCountries(customers, 12) : []
  const continentData = hasData ? getCustomersByContinent(customers) : []
  const yearlyData = hasData ? getSubscriptionsByYear(customers) : []
  const domainData = hasData ? getDomainDistribution(customers) : []
  const continentCountryMapping: Record<string, string[]> = {
    "North America": ["United States of America", "Canada", "Mexico"],
    Europe: ["United Kingdom", "Germany", "France", "Italy", "Spain", "Liechtenstein", "Latvia"],
    Asia: ["China", "Japan", "India", "Korea", "Macao", "Nepal"],
    Oceania: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
  }
  const treemapCountries = topCountries.filter(country => country.name !== "Others")
  const visibleContinents = continentData.filter(continent => continent.name !== "Other").slice(0, 5)
  const treemapData = visibleContinents
    .map(continent => {
      const children = treemapCountries
        .filter(country => continentCountryMapping[continent.name]?.includes(country.name))
        .map(country => ({ name: country.name, value: country.value }))

      return {
        name: continent.name,
        value: children.reduce((sum, item) => sum + item.value, 0),
        children,
      }
    })
    .filter(continent => continent.children.length > 0)

  return (
    <>
      <PageHeader
        title="Composition"
        breadcrumbs={[{ label: "Composition" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Donut chart */}
          <ChartCard
            title="Continental Composition"
            description="Customer share by continent"
          >
            <PieChartComponent
              height={350}
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
                    radius: ["45%", "75%"],
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
                        fontSize: 16,
                        fontWeight: "bold",
                      },
                    },
                    labelLine: {
                      show: false,
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

          {/* Nested pie */}
          <ChartCard
            title="Yearly Distribution"
            description="Subscription composition by year"
          >
            <PieChartComponent
              height={350}
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
                  orient: "horizontal",
                  bottom: 0,
                },
                series: [
                  {
                    name: "Years",
                    type: "pie",
                    selectedMode: "single",
                    radius: [0, "45%"],
                    label: {
                      position: "inner",
                      fontSize: 12,
                    },
                    labelLine: {
                      show: false,
                    },
                    data: yearlyData.map(d => ({
                      name: d.year,
                      value: d.count,
                    })),
                  },
                  {
                    name: "Domains",
                    type: "pie",
                    radius: ["55%", "75%"],
                    labelLine: {
                      length: 20,
                    },
                    label: {
                      formatter: "{b}: {d}%",
                    },
                    data: domainData.slice(0, 6).map(d => ({
                      name: `.${d.domain}`,
                      value: d.count,
                    })),
                  },
                ],
              }}
            />
          </ChartCard>
        </div>

        {/* Treemap */}
        <ChartCard
          title="Country Composition Treemap"
          description="Hierarchical view of customer distribution"
        >
          <TreemapChartComponent
            height={380}
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
                    formatter: "{b}\n{c}",
                  },
                  upperLabel: {
                    show: true,
                    height: 30,
                  },
                  data: treemapData,
                },
              ],
            }}
          />
        </ChartCard>

        {/* Sankey */}
        <ChartCard
          title="Customer Flow"
          description="Flow visualization from year to continent"
        >
          <SankeyChartComponent
            height={400}
            option={{
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
              },
              series: [
                {
                  type: "sankey",
                  emphasis: {
                    focus: "adjacency",
                  },
                  nodeAlign: "left",
                  lineStyle: {
                    color: "gradient",
                    curveness: 0.5,
                  },
                  data: [
                    ...yearlyData.map(y => ({ name: y.year })),
                    ...visibleContinents.map(c => ({ name: c.name })),
                  ],
                  links: yearlyData.flatMap(year =>
                    visibleContinents.map(continent => ({
                      source: year.year,
                      target: continent.name,
                      value: Math.max(1, Math.round((year.count * continent.value) / customers.length)),
                    }))
                  ),
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </>
  )
}
