
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Home, Wallet, Activity, Search, Settings, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const AppSidebar = () => {
  const location = useLocation();
  
  const mainNavItems = [
    { title: 'Dashboard', icon: Home, path: '/dashboard' },
    { title: 'Wallets', icon: Wallet, path: '/wallet' },
    { title: 'Traces', icon: Activity, path: '/trace' },
    { title: 'Analytics', icon: BarChart2, path: '/analytics' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  const toolsNavItems = [
    { title: 'Explorer', icon: Search, path: '/explorer' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    if (path === '/wallet' && location.pathname.includes('/wallet')) return true;
    if (path === '/trace' && location.pathname.includes('/trace')) return true;
    if (path === '/settings' && location.pathname.includes('/settings')) return true;
    if (path === '/analytics' && location.pathname.includes('/analytics')) return true;
    if (path === '/explorer' && location.pathname.includes('/explorer')) return true;
    return location.pathname === path;
  };

  return (
    <Sidebar className="glass backdrop-blur-md border-r border-white/10">
      <SidebarHeader className="flex items-center px-4 py-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
            ETHER-EYE
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400">
            MAIN NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path}
                      className={`flex items-center space-x-2 ${
                        isActive(item.path) 
                          ? 'text-white bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-white/10' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {isActive(item.path) && <ChevronRight size={14} className="ml-auto" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400">
            TOOLS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path}
                      className={`flex items-center space-x-2 ${
                        isActive(item.path) 
                          ? 'text-white bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-white/10' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {isActive(item.path) && <ChevronRight size={14} className="ml-auto" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-4">
        <Button variant="outline" className="w-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
          <Search className="h-4 w-4 mr-2" />
          Search Blockchain
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
