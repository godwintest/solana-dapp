
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { JupiterProvider } from "@jup-ag/react-hook";
import { Connection } from "@solana/web3.js";

const queryClient = new QueryClient();
// Create a Solana connection for Jupiter
const connection = new Connection("https://api.mainnet-beta.solana.com");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <JupiterProvider connection={connection}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </JupiterProvider>
  </QueryClientProvider>
);

export default App;
