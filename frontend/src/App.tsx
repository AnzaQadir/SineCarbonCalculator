import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecommendationScreen from '@/pages/RecommendationScreen';
import ResultsScreen from '@/pages/ResultsScreen';
import InviteScreen from '@/pages/InviteScreen';
import ReflectionScreen from './pages/ReflectionScreen';
import Signup from './pages/Signup';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import PersonalizedDashboard from './pages/PersonalizedDashboard';
import EngagementHome from './pages/EngagementHome';
import Journey from './pages/Journey';
import ShareView from './pages/ShareView';
import Methodology from './pages/Methodology';
import { Analytics } from '@vercel/analytics/react';
import { me, checkUserExists } from '@/services/api';
import { useUserStore } from '@/stores/userStore';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Hydrate user from cookie and localStorage on initial load
  useEffect(() => {
    (async () => {
      try {
        // Check if user is authenticated via cookie
        const resp = await me();
        if (resp?.success && resp?.email) {
          const email = resp.email;
          const { setUser } = useUserStore.getState();
          
          // Get current user from store (may be loaded from localStorage)
          const currentUser = useUserStore.getState().user;
          
          // If we don't have user data yet, set fallback name
          if (!currentUser) {
            const fallbackName = (email.split('@')[0] || 'Friend');
            setUser({ name: fallbackName, email });
          }
          
          // Always call /check to get full user data (firstName, etc.)
          try {
            const checkResp = await checkUserExists(email);
            if (checkResp?.success && checkResp?.exists && checkResp?.user) {
              const u = checkResp.user;
              if (u?.id) localStorage.setItem('zerrah_user_id', u.id);
              setUser({ 
                id: u.id, 
                name: u.firstName || (email.split('@')[0] || 'Friend'), 
                email: u.email 
              });
            }
          } catch (checkError) {
            // If /check fails, keep the basic user data from /me
            console.warn('Failed to enrich user data:', checkError);
          }
        }
      } catch (error) {
        // If /me fails, user is not authenticated - clear user store
        const { clearUser } = useUserStore.getState();
        clearUser();
      }
    })();
  }, []); // Only run once on mount

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/recommendations" element={<RecommendationScreen />} />
              <Route path="/results" element={<ResultsScreen />} />
              <Route path="/invite" element={<InviteScreen />} />
              <Route path="/reflections" element={<ReflectionScreen />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<PersonalizedDashboard />} />
              <Route path="/engagement" element={<EngagementHome />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/share/:id" element={<ShareView />} />
              <Route path="/methodology" element={<Methodology />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      <Analytics />
    </StrictMode>
  );
}

export default App;
