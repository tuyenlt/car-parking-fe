import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Users, CarFront, Car } from "lucide-react"
import { Link } from "react-router-dom"

const menuItems = [
  {
    title: "Lịch Sử Ra Vào",
    url: "/entry-history",
    icon: Home,
  },
  {
    title: "Trạng Thái Bãi Xe",
    url: "/lot-status",
    icon: Car,
  },
  {
    title: "Thanh Toán",
    url: "/payment",
    icon: Users,
  },
]

export function LeftSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CarFront className="h-4 w-4" />
          </div>
          <span className="font-semibold text-lg">IOT16</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          © 2025 Edu Center
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
