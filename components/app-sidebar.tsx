"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  LayoutDashboardIcon,
  UsersIcon,
  GlobeIcon,
  TrendingUpIcon,
  BarChart3Icon,
  PieChartIcon,
  ActivityIcon,
} from "lucide-react"

// Dashboard navigation data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: <UsersIcon />,
      items: [
        {
          title: "All Customers",
          url: "/dashboard/customers",
        },
        {
          title: "Segments",
          url: "/dashboard/customers/segments",
        },
      ],
    },
    {
      title: "Geography",
      url: "/dashboard/geography",
      icon: <GlobeIcon />,
      items: [
        {
          title: "By Country",
          url: "/dashboard/geography",
        },
        {
          title: "By Region",
          url: "/dashboard/geography/regions",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: <ActivityIcon />,
      items: [
        {
          title: "Trends",
          url: "/dashboard/analytics",
        },
        {
          title: "Comparisons",
          url: "/dashboard/analytics/comparisons",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Trend Analysis",
      url: "/dashboard/trends",
      icon: <TrendingUpIcon />,
    },
    {
      name: "Distribution Charts",
      url: "/dashboard/distribution",
      icon: <BarChart3Icon />,
    },
    {
      name: "Composition",
      url: "/dashboard/composition",
      icon: <PieChartIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
