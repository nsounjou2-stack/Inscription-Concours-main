import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminSetup from "./pages/AdminSetup";
import AdminRegister from "./pages/AdminRegister";
import AdminLoginTest from "./pages/AdminLoginTest";
import SimpleAdminLogin from "./pages/SimpleAdminLogin";
import Debug from "./pages/Debug";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import SimpleAuthGuard from "./components/SimpleAuthGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/admin-test" element={<AdminLoginTest />} />
          <Route path="/simple-admin-login" element={<SimpleAdminLogin />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="/admin" element={<SimpleAuthGuard><Admin /></SimpleAuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
