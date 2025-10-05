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
import Journey from './pages/Journey';
import ShareView from './pages/ShareView';
import { Analytics } from '@vercel/analytics/react';
import { me } from '@/services/api';
import { useUserStore } from '@/stores/userStore';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Hydrate user from cookie on initial load
  const { setUser, user } = useUserStore();
  useEffect(() => {
    (async () => {
      try {
        const resp = await me();
        if (resp?.success && resp?.email) {
          const fallbackName = (resp.email.split('@')[0] || 'Friend');
          if (!user) setUser({ name: fallbackName, email: resp.email });
        }
      } catch {}
    })();
  }, []);

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
              <Route path="/journey" element={<Journey />} />
              <Route path="/share/:id" element={<ShareView />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      <Analytics />
    </StrictMode>
  );
}

export default App;
