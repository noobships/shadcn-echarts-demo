"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { PieChartComponent } from "@/components/pie-chart"
import { FunnelChartComponent } from "@/components/funnel-chart"
import { SunburstChartComponent } from "@/components/sunburst-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getCustomersByContinent,
  getSubscriptionsByYear,
  getTopCountries,
} from "@/lib/customer-data"

export default function SegmentsPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Segments"
          breadcrumbs={[
            { label: "Customers", href: "/dashboard/customers" },
            { label: "Segments" },
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

  const continentData = getCustomersByContinent(customers)
  const yearlyData = getSubscriptionsByYear(customers)
  const topCountries = getTopCountries(customers, 20)

  // Create sunburst data structure
  const sunburstData = continentData.map(continent => ({
    name: continent.name,
    value: continent.value,
    children: topCountries
      .filter(country => {
        // Simple mapping logic
        const continentMapping: Record<string, string[]> = {
          'North America': ['United States of America', 'Canada', 'Mexico'],
          'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Poland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Liechtenstein', 'Latvia'],
          'Asia': ['China', 'Japan', 'India', 'Korea', 'Singapore', 'Thailand', 'Vietnam', 'Malaysia', 'Indonesia', 'Philippines', 'Macao', 'Nepal', 'Bangladesh', 'Sri Lanka'],
          'Oceania': ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'],
          'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'],
          'Africa': ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana', 'Uganda', 'Sudan', 'Burundi'],
        }
        return continentMapping[continent.name]?.includes(country.name)
      })
      .slice(0, 5)
      .map(country => ({
        name: country.name,
        value: country.value,
      })),
  })).filter(d => d.children.length > 0)

  return (
    <>
      <PageHeader
        title="Segments"
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          { label: "Segments" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Customer Segments by Continent"
            description="Distribution of customers across continents"
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

          <ChartCard
            title="Yearly Subscription Funnel"
            description="Customer acquisition by year"
          >
            <FunnelChartComponent
              height={350}
              option={{
                tooltip: {
                  trigger: "item",
                  formatter: "{b}: {c}",
                },
                series: [
                  {
                    name: "Years",
                    type: "funnel",
                    left: "10%",
                    width: "80%",
                    minSize: "20%",
                    maxSize: "100%",
                    sort: "descending",
                    gap: 4,
                    label: {
                      show: true,
                      position: "inside",
                      formatter: "{b}\n{c}",
                    },
                    itemStyle: {
                      borderWidth: 0,
                      borderRadius: 4,
                    },
                    data: yearlyData.map(d => ({
                      name: d.year,
                      value: d.count,
                    })),
                  },
                ],
              }}
            />
          </ChartCard>
        </div>

        <ChartCard
          title="Regional Hierarchy"
          description="Sunburst view of customers by continent and country"
        >
          <SunburstChartComponent
            height={450}
            option={{
              tooltip: {
                trigger: "item",
                formatter: "{b}: {c}",
              },
              series: [
                {
                  type: "sunburst",
                  data: sunburstData,
                  radius: ["15%", "90%"],
                  itemStyle: {
                    borderRadius: 4,
                    borderWidth: 2,
                  },
                  label: {
                    rotate: "radial",
                  },
                  emphasis: {
                    focus: "ancestor",
                  },
                  levels: [
                    {},
                    {
                      r0: "15%",
                      r: "45%",
                      label: {
                        rotate: "tangential",
                      },
                    },
                    {
                      r0: "45%",
                      r: "90%",
                      label: {
                        align: "right",
                      },
                    },
                  ],
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </>
  )
}
