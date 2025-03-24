
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import WalletAnalysis from "./pages/WalletAnalysis";
import TraceView from "./pages/TraceView";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import MainLayout from "./components/layout/MainLayout";
import StarField from "./components/dashboard/StarField";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen">
          <StarField className="fixed inset-0 z-[-1]" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/wallet/:address" element={<MainLayout><WalletAnalysis /></MainLayout>} />
              <Route path="/trace/:hash" element={<MainLayout><TraceView /></MainLayout>} />
              <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              <Route path="/explorer" element={<MainLayout><Analytics /></MainLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
