"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { RadarChartComponent } from "@/components/radar-chart"
import { PieChartComponent } from "@/components/pie-chart"
import { BarChartComponent } from "@/components/bar-chart"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  getCustomersByContinent,
  getTopCountries,
} from "@/lib/customer-data"
import {
  barStartEdgeRadius,
  chartMotionDefaults,
  safeSeriesBorderStyle,
  tooltipMarkerLabelValue,
} from "@/lib/chart-options"

export default function RegionsPage() {
  const { customers } = useCustomerData()

  const hasData = customers.length > 0
  const continentData = hasData ? getCustomersByContinent(customers) : []
  const topCountries = hasData ? getTopCountries(customers, 20) : []

  // Group countries by region for comparison
  const regionData = {
    'Americas': topCountries.filter(c => 
      ['United States of America', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia'].includes(c.name)
    ),
    'Europe': topCountries.filter(c => 
      ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Liechtenstein', 'Latvia'].includes(c.name)
    ),
    'Asia Pacific': topCountries.filter(c => 
      ['China', 'Japan', 'India', 'Korea', 'Singapore', 'Thailand', 'Australia', 'New Zealand', 'Macao', 'Nepal'].includes(c.name)
    ),
  }

  return (
    <>
      <PageHeader
        title="Regions"
        breadcrumbs={[
          { label: "Geography", href: "/dashboard/geography" },
          { label: "Regions" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Continental Radar"
            description="Customer distribution across continents"
          >
            <RadarChartComponent
              height={380}
              option={{
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  data: ["Customer Count"],
                  bottom: 0,
                },
                radar: {
                  indicator: continentData.map(d => ({
                    name: d.name,
                    max: Math.max(...continentData.map(x => x.value), 1) * 1.2,
                  })),
                  shape: "polygon",
                  splitNumber: 5,
                },
                series: [
                  {
                    name: "Regions",
                    type: "radar",
                    data: continentData.length > 0
                      ? [{
                          value: continentData.map(d => d.value),
                          name: "Customer Count",
                          areaStyle: { opacity: 0.3 },
                          lineStyle: { width: 2 },
                        }]
                      : [],
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard
            title="Continental Share"
            description="Percentage breakdown by continent"
          >
            <PieChartComponent
              height={380}
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
                    name: "Continent",
                    type: "pie",
                    radius: ["30%", "65%"],
                    center: ["50%", "45%"],
                    roseType: "radius",
                    itemStyle: {
                      borderRadius: 6,
                      ...safeSeriesBorderStyle(2),
                    },
                    label: {
                      show: true,
                      formatter: "{b}",
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

        {/* Regional comparison */}
        <ChartCard
          title="Regional Comparison"
          description="Top countries by major region"
        >
          <BarChartComponent
            height={400}
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
              },
              legend: {
                data: Object.keys(regionData),
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
                data: ["1st", "2nd", "3rd", "4th", "5th"],
                name: "Rank",
              },
              yAxis: {
                type: "value",
                name: "Customers",
              },
              series: Object.entries(regionData).map(([region, countries]) => ({
                name: region,
                type: "bar",
                data: countries.slice(0, 5).map(c => c.value),
                itemStyle: {
                  borderRadius: barStartEdgeRadius("vertical", 4),
                },
              })),
            }}
          />
        </ChartCard>
      </div>
    </>
  )
}
