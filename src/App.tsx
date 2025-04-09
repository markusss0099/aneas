
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import TicketsPage from "./pages/TicketsPage";
import PullingPage from "./pages/PullingPage";
import AnalysisPage from "./pages/AnalysisPage";
import SummaryPage from "./pages/SummaryPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ReactNode } from "react";

// Configure QueryClient with optimal settings for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching when window is focused
      retry: 1, // Limit retries for failed queries
      staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for this duration
      gcTime: 1000 * 60 * 30, // 30 minutes - how long to keep unused data in cache
    },
  },
});

// Lazy loading for routes to improve initial load time
const withLazyLoading = (Component: React.ComponentType<any>): ReactNode => {
  return (
    <Layout>
      <Component />
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Pagina di login pubblica */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotte protette */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {withLazyLoading(Dashboard)}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute>
                {withLazyLoading(TicketsPage)}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pulling" 
            element={
              <ProtectedRoute>
                {withLazyLoading(PullingPage)}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analysis" 
            element={
              <ProtectedRoute>
                {withLazyLoading(AnalysisPage)}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/summary" 
            element={
              <ProtectedRoute>
                {withLazyLoading(SummaryPage)}
              </ProtectedRoute>
            } 
          />
          
          {/* Rotta di fallback per la pagina non trovata */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
