import { LeftSidebar } from './LeftSideBar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { useUserContext } from '@/providers/authContext';

export default function RootLayout() {
	const {user} = useUserContext();
	
  return (
    <SidebarProvider >
      <LeftSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 justify-between">
					<div className='flex'>
						<SidebarTrigger className="-ml-1" />
						<div className="flex items-center gap-2">
							<h1 className="text-xl font-semibold">IOT16</h1>
						</div>
					</div>
					<div className="flex font-semibold">
						{user && user.username.toUpperCase()}
					</div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
