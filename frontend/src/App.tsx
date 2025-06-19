import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecommendationScreen from '@/pages/RecommendationScreen';
import ResultsScreen from '@/pages/ResultsScreen';
import InviteScreen from '@/pages/InviteScreen';
import ReflectionScreen from './pages/ReflectionScreen';
import Signup from './pages/Signup';
import Quiz from './pages/Quiz';

// Create a client
const queryClient = new QueryClient();

function App() {
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
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
