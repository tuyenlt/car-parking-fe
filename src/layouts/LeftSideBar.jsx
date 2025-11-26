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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUserContext } from "@/providers/authContext"
import { Home, Users, CarFront, Car, LogOut, User, Ticket } from "lucide-react"
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
  }
]

export function LeftSidebar() {
	const { logout } = useUserContext();
	const {user} = useUserContext();
	if(user?.role === 'admin'){
		if(!menuItems.find(item => item.title === "Điều Khiển")){
			menuItems.push({
				title: "Điều Khiển",
				url: "/control",
				icon: User,
			})
		}
	}
	if(user?.role === 'user' && !menuItems.find(item => item.title === "Vé Tháng")){
		menuItems.push({
			title: "Vé Tháng",
			url: "/membership",
			icon: Ticket,
		})
	}

	const handleLogout = async () => {
		await logout();
	};

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
                  <SidebarMenuButton size="lg" asChild>
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
        <div className="px-3 py-2 space-y-3">

          <Separator />

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>

          {/* Copyright */}
          <div className="px-3 text-xs text-muted-foreground text-center">
            © 2025 IOT16
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
