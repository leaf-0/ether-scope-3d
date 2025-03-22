
import { ReactNode } from 'react';
import Navbar from './Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 pt-20 px-4 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
