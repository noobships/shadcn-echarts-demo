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

export default function CompositionPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Composition"
          breadcrumbs={[{ label: "Composition" }]}
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

  const topCountries = getTopCountries(customers, 12)
  const continentData = getCustomersByContinent(customers)
  const yearlyData = getSubscriptionsByYear(customers)
  const domainData = getDomainDistribution(customers)

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
                    radius: ["45%", "75%"],
                    center: ["40%", "50%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 8,
                      borderColor: "var(--background)",
                      borderWidth: 3,
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
                tooltip: {
                  trigger: "item",
                  formatter: "{b}: {c} ({d}%)",
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
                formatter: "{b}: {c} customers ({d}%)",
              },
              series: [
                {
                  type: "treemap",
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
                  itemStyle: {
                    borderColor: "var(--background)",
                    borderWidth: 2,
                    gapWidth: 2,
                    borderRadius: 4,
                  },
                  levels: [
                    {
                      itemStyle: {
                        borderWidth: 0,
                        gapWidth: 5,
                      },
                    },
                    {
                      itemStyle: {
                        gapWidth: 1,
                      },
                    },
                  ],
                  data: continentData.slice(0, 5).map(continent => ({
                    name: continent.name,
                    value: continent.value,
                    children: topCountries
                      .filter(country => {
                        const mapping: Record<string, string[]> = {
                          'North America': ['United States of America', 'Canada', 'Mexico'],
                          'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Liechtenstein', 'Latvia'],
                          'Asia': ['China', 'Japan', 'India', 'Korea', 'Macao', 'Nepal'],
                          'Oceania': ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'],
                          'Other': [],
                        }
                        return mapping[continent.name]?.includes(country.name)
                      })
                      .map(c => ({ name: c.name, value: c.value })),
                  })),
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
                    ...continentData.slice(0, 5).map(c => ({ name: c.name })),
                  ],
                  links: yearlyData.flatMap(year =>
                    continentData.slice(0, 5).map(continent => ({
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
