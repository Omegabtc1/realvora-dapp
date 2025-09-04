
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import KYCVerificationPage from "./pages/KYCVerificationPage";
import UserProfilePage from "./pages/UserProfilePage";
import DashboardPage from "./pages/DashboardPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProfilePage from "./pages/ProfilePage";
import GovernancePage from "./pages/GovernancePage";
import PropertyAnalyticsPage from "./pages/PropertyAnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/kyc-verification" element={<KYCVerificationPage />} />
              <Route path="/user-profile" element={<ProtectedRoute requireAuth={true}><UserProfilePage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute requireAuth={true} requireKYC={true} requireWallet={true}><DashboardPage /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute requireAuth={true} requireKYC={true}><MarketplacePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute requireAuth={true}><ProfilePage /></ProtectedRoute>} />
              <Route path="/governance" element={<ProtectedRoute requireAuth={true} requireKYC={true} requireWallet={true}><GovernancePage /></ProtectedRoute>} />
              <Route path="/property/:propertyId/analytics" element={<ProtectedRoute requireAuth={true} requireKYC={true}><PropertyAnalyticsPage /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
