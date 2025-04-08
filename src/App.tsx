
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

const queryClient = new QueryClient();

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
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute>
                <Layout><TicketsPage /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pulling" 
            element={
              <ProtectedRoute>
                <Layout><PullingPage /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analysis" 
            element={
              <ProtectedRoute>
                <Layout><AnalysisPage /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/summary" 
            element={
              <ProtectedRoute>
                <Layout><SummaryPage /></Layout>
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
