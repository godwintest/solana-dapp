
import { useEffect, useMemo, useState } from "react";
import { useJupiter } from "@jup-ag/react-hook";
import { PublicKey, Connection } from "@solana/web3.js";
import JSBI from "jsbi";
import { MAINNET_TOKENS } from "@/components/Swap";
import { QuoteResponseMeta, RouteInfo } from "@/lib/jupiter-types";

export function useJupiterSwap({
  fromToken,
  toToken,
  fromAmount,
}: {
  fromToken: string,
  toToken: string,
  fromAmount: string,
}) {
  const [price, setPrice] = useState<number | null>(null);
  const [quote, setQuote] = useState<any>(null);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [priceRefreshInterval, setPriceRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenBalances, setTokenBalances] = useState<{[key: string]: string}>({});

  const inputTokenInfo = MAINNET_TOKENS.find((tk) => tk.symbol === fromToken);
  const outputTokenInfo = MAINNET_TOKENS.find((tk) => tk.symbol === toToken);

  const amount = useMemo(() => {
    if (!fromAmount || isNaN(Number(fromAmount))) return undefined;
    const decimals = inputTokenInfo?.decimals ?? 9;
    try {
      // Use floor instead of round to avoid potential overflow
      return JSBI.BigInt(Math.floor(Number(fromAmount) * Math.pow(10, decimals)));
    } catch (error) {
      console.error("Error converting amount to BigInt:", error);
      return undefined;
    }
  }, [fromAmount, inputTokenInfo]);

  const connection = useMemo(() => new Connection("https://api.mainnet-beta.solana.com"), []);
  
  // Fetch price function - extracted for reuse
  const fetchPrice = async () => {
    try {
      if (!fromToken || !toToken) {
        setPrice(null);
        return;
      }
      const fromMint = inputTokenInfo?.mint;
      const toMint = outputTokenInfo?.mint;
      if (!fromMint || !toMint) { 
        setPrice(null); 
        return; 
      }
      const url = `https://price.jup.ag/v4/price?ids=${fromMint}&vsToken=${toMint}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.data && data.data[fromMint]?.["price"]) {
        setPrice(Number(data.data[fromMint]["price"]));
      } else {
        setPrice(null);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
      setPrice(null);
    }
  };

  // Fetch token balances
  const fetchTokenBalances = async (publicKey: PublicKey | null) => {
    if (!publicKey) return;
    
    try {
      // Mock balances for demo purposes
      // In a real app, you would fetch actual balances from the blockchain
      setTokenBalances({
        SOL: "1.5",
        USDC: "100.0",
        BONK: "10000.0",
        RAY: "25.0"
      });
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  // Setup real-time price updates
  useEffect(() => {
    // Clear any existing interval when dependencies change
    if (priceRefreshInterval) {
      clearInterval(priceRefreshInterval);
      setPriceRefreshInterval(null);
    }
    
    // Return early if we don't have both tokens
    if (!fromToken || !toToken || !inputTokenInfo?.mint || !outputTokenInfo?.mint) {
      setPrice(null);
      return;
    }
    
    // Initial price fetch
    fetchPrice();
    
    // Set up interval for real-time updates (every 10 seconds)
    const interval = setInterval(fetchPrice, 10000);
    setPriceRefreshInterval(interval);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fromToken, toToken, inputTokenInfo, outputTokenInfo]);

  // Create PublicKey objects safely
  const inputMint = useMemo(() => {
    try {
      return inputTokenInfo && inputTokenInfo.mint ? new PublicKey(inputTokenInfo.mint) : undefined;
    } catch (err) {
      console.error("Invalid input mint", err);
      return undefined;
    }
  }, [inputTokenInfo]);
  
  const outputMint = useMemo(() => {
    try {
      return outputTokenInfo && outputTokenInfo.mint ? new PublicKey(outputTokenInfo.mint) : undefined;
    } catch (err) {
      console.error("Invalid output mint", err);
      return undefined;
    }
  }, [outputTokenInfo]);

  // Use Jupiter hook with proper error handling
  const {
    exchange,
    loading: jupLoading,
    error: jupError,
    refresh,
    lastRefreshTimestamp,
    quoteResponseMeta
  } = useJupiter({
    amount: amount,
    inputMint: inputMint,
    outputMint: outputMint,
    slippageBps: 50,
    debounceTime: 250,
  }) || { exchange: null, loading: false, error: null, refresh: () => {}, lastRefreshTimestamp: 0, quoteResponseMeta: null };

  // Fetch initial balances
  useEffect(() => {
    // In a real app, you would get the connected wallet's public key
    // For now, we'll use a mock public key just to initialize the balances
    const mockPublicKey = new PublicKey("11111111111111111111111111111111");
    fetchTokenBalances(mockPublicKey);
  }, []);

  useEffect(() => {
    try {
      if (quoteResponseMeta) {
        setQuote(quoteResponseMeta);
        setError(null);
        
        // Access routes from quoteResponseMeta
        if (quoteResponseMeta && 'routes' in quoteResponseMeta && Array.isArray(quoteResponseMeta.routes)) {
          setRoutes(quoteResponseMeta.routes);
        } else {
          // Fallback to accessing routes if differently structured
          const routesData = (quoteResponseMeta as any).routes;
          if (Array.isArray(routesData)) {
            setRoutes(routesData);
          } else {
            setRoutes([]);
          }
        }
      }
    } catch (error) {
      console.error("Error processing quote response:", error);
      setError("Failed to process quote");
      setRoutes([]);
    }
  }, [quoteResponseMeta]);

  // Set error state if there's a Jupiter error
  useEffect(() => {
    if (jupError) {
      setError(jupError.toString());
    }
  }, [jupError]);

  return {
    price,
    quote,
    exchange,
    routes,
    jupLoading,
    jupError: error || jupError,
    refresh,
    lastRefreshTimestamp,
    inputTokenInfo,
    outputTokenInfo,
    connection,
    fetchPrice,
    error,
    tokenBalances
  };
}
