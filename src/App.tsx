import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useSearchParams } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";



const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAIL || "").split(",").map((e: string) => e.trim());

  if (loading) return null;
  if (!user || !adminEmails.includes(user.email || "")) return <Navigate to="/" />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  if (loading) return null;
  if (!user) return <>{children}</>;
  
  const redirectTo = searchParams.get('redirect') || localStorage.getItem('auth_redirect') || "/app";
  const isDownload = searchParams.get('download') === 'true' || localStorage.getItem('pending_download') === 'true';
  
  // Clean up
  localStorage.removeItem('auth_redirect');
  
  return <Navigate to={redirectTo + (isDownload ? '?download=true' : '')} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/auth" 
              element={
                <AuthRoute>
                  <AuthPage />
                </AuthRoute>
              } 
            />
            <Route 
              path="/app" 
              element={<Index />} 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
