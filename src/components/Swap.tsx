
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useJupiterSwap } from "@/hooks/useJupiterSwap";
import { SwapForm } from "@/components/SwapForm";
import { AuthDialog } from "@/components/AuthDialog";
import JSBI from "jsbi";

export const MAINNET_TOKENS = [
  { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", decimals: 9 },
  { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
  { symbol: "BONK", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", decimals: 5 },
  { symbol: "RAY", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", decimals: 6 },
];

export function Swap() {
  const { isAuthenticated, publicKey, passkey, login } = useAuth();
  const { toast } = useToast();

  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [jupiterAvailable, setJupiterAvailable] = useState(true);
  const [authCancelled, setAuthCancelled] = useState(false);

  const {
    price,
    routes,
    exchange,
    jupLoading,
    inputTokenInfo,
    outputTokenInfo,
    refresh,
    quote,
    fetchPrice,
    error: jupError,
    tokenBalances
  } = useJupiterSwap({ 
    fromToken, 
    toToken, 
    fromAmount: fromAmount.trim() ? fromAmount : "0"  // Always provide a valid number
  });

  // Check if Jupiter is available
  useEffect(() => {
    if (jupLoading === false) {
      if (!exchange) {
        setJupiterAvailable(false);
        console.log("Jupiter exchange function is not available");
      } else {
        setJupiterAvailable(true);
      }
    }
  }, [jupLoading, exchange]);

  // Handle Jupiter errors in UI
  useEffect(() => {
    if (jupError && fromAmount.trim() !== '') {
      console.log("Jupiter error:", jupError);
      toast({
        title: "Swap Service Issue",
        description: "There was an issue connecting to the swap service. Please try again later.",
        variant: "destructive",
      });
    }
  }, [jupError, fromAmount, toast]);
  
  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      toast({ title: "Address copied", description: publicKey.toString() });
    }
  };

  const withAuthentication = async (action: () => Promise<void>) => {
    setPendingAction(() => action);
    setAuthCancelled(false);
    setAuthDialogOpen(true);
  };

  const handleAuthDialogClose = () => {
    setPendingAction(null);
    setAuthDialogOpen(false);
    setAuthCancelled(true);
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    try {
      await login();
      if (authCancelled) {
        toast({
          title: "Authentication cancelled",
          description: "You cancelled the authentication process",
          variant: "destructive",
        });
        setAuthDialogOpen(false);
        return;
      }
      setAuthDialogOpen(false);
      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);
        await action();
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle amount input change with improved parsing
  const handleFromAmountChange = (value: string) => {
    // Allow empty string
    if (value === '') {
      setFromAmount('');
      return;
    }
    
    // Only allow valid positive numbers
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setFromAmount(value);
      // Trigger a manual price refresh when amount changes significantly
      fetchPrice?.();
    }
  };

  const handleSwap = async () => {
    if (!publicKey || !isAuthenticated || !passkey) {
      await withAuthentication(handleSwap);
      return;
    }
    
    if (authCancelled) {
      toast({
        title: "Authentication cancelled",
        description: "Please authenticate to perform this action",
        variant: "destructive",
      });
      return;
    }

    if (!fromAmount || Number(fromAmount) <= 0 || !routes?.[0] || !inputTokenInfo) {
      toast({ title: "Invalid", description: "Enter an amount and make sure a conversion route is found.", variant: "destructive" });
      return;
    }
    
    if (!exchange || !jupiterAvailable) {
      toast({ 
        title: "Jupiter unavailable", 
        description: "The swap service is currently unavailable. Please try again later.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    setSwapError(null);
    
    try {
      const bestRoute = routes[0];
      
      const result = await exchange({
        wrapUnwrapSOL: true,
        quoteResponseMeta: quote,
        prioritizationFeeLamports: "auto"  // Add this required parameter
      });

      const txSignature = result && ('signature' in result ? result.signature : ('txid' in result ? result.txid : undefined));

      if (!txSignature) {
        throw new Error("Swap transaction failed: No transaction signature returned");
      }

      toast({
        title: "Swap executed!",
        description: `Swapped ${fromAmount} ${fromToken} for ~${(price && fromAmount ? (Number(fromAmount) * price).toFixed(4) : '')} ${toToken}`
      });
      setFromAmount("");
      refresh();
      fetchPrice?.();
    } catch (error: any) {
      setSwapError(error.message || "Unknown error occurred");
      toast({
        title: "Swap failed",
        description: error.message || "Swap could not be completed",
        variant: "destructive",
      });
      console.error("Jupiter swap failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    fetchPrice?.();
  };

  return (
    <>
      <SwapForm
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        setFromToken={(token) => { setFromToken(token); fetchPrice?.(); }}
        setToToken={(token) => { setToToken(token); fetchPrice?.(); }}
        setFromAmount={handleFromAmountChange}
        switchTokens={switchTokens}
        onSwap={handleSwap}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        jupLoading={jupLoading}
        price={price}
        routes={routes}
        MAINNET_TOKENS={MAINNET_TOKENS}
        publicKey={publicKey ? publicKey.toString() : null}
        handleCopyAddress={handleCopyAddress}
        refreshPrice={() => fetchPrice?.()}
        error={jupError || swapError}
        tokenBalances={tokenBalances}
      />
      <AuthDialog
        open={authDialogOpen}
        loading={isLoading}
        onCancel={handleAuthDialogClose}
        onAuthenticate={handleAuthenticate}
      />
    </>
  );
}
