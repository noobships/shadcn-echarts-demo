"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TreemapChartComponent } from "@/components/treemap-chart"
import { BarChartComponent } from "@/components/bar-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getTopCountries,
  getTopCities,
  calculateGrowthMetrics,
} from "@/lib/customer-data"
import { StatCard } from "@/components/dashboard/stat-card"
import { GlobeIcon, MapPinIcon, FlagIcon, BuildingIcon } from "lucide-react"

export default function GeographyPage() {
  const { customers, isLoading } = useCustomerData()

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Geography"
          breadcrumbs={[{ label: "Geography" }]}
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

  const metrics = calculateGrowthMetrics(customers)
  const topCountries = getTopCountries(customers, 15)
  const topCities = getTopCities(customers, 15)

  return (
    <>
      <PageHeader
        title="Geography"
        breadcrumbs={[{ label: "Geography" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Countries"
            value={metrics.uniqueCountries}
            description="Active regions"
            icon={<GlobeIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Top Country"
            value={topCountries[0]?.name || "N/A"}
            description={`${topCountries[0]?.value || 0} customers`}
            icon={<FlagIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Top City"
            value={topCities[0]?.name || "N/A"}
            description={`${topCities[0]?.value || 0} customers`}
            icon={<MapPinIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Companies"
            value={metrics.uniqueCompanies}
            description="Across all regions"
            icon={<BuildingIcon className="h-5 w-5" />}
          />
        </div>

        {/* Treemap */}
        <ChartCard
          title="Country Distribution Treemap"
          description="Visual representation of customer distribution by country"
        >
          <TreemapChartComponent
            height={400}
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
                    formatter: "{b}\n{c}",
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
                  data: topCountries.map(d => ({
                    name: d.name,
                    value: d.value,
                  })),
                },
              ],
            }}
          />
        </ChartCard>

        {/* Bar charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Top Countries"
            description="Customer count by country"
          >
            <BarChartComponent
              height={350}
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
                  type: "value",
                },
                yAxis: {
                  type: "category",
                  data: topCountries.slice(0, 10).map(d => d.name).reverse(),
                  axisLabel: {
                    width: 100,
                    overflow: "truncate",
                  },
                },
                series: [
                  {
                    name: "Customers",
                    type: "bar",
                    data: topCountries.slice(0, 10).map(d => d.value).reverse(),
                    itemStyle: {
                      borderRadius: [0, 4, 4, 0],
                    },
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard
            title="Top Cities"
            description="Customer count by city"
          >
            <BarChartComponent
              height={350}
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
                  type: "value",
                },
                yAxis: {
                  type: "category",
                  data: topCities.slice(0, 10).map(d => d.name).reverse(),
                  axisLabel: {
                    width: 100,
                    overflow: "truncate",
                  },
                },
                series: [
                  {
                    name: "Customers",
                    type: "bar",
                    data: topCities.slice(0, 10).map(d => d.value).reverse(),
                    itemStyle: {
                      borderRadius: [0, 4, 4, 0],
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
