import { PublicKey, TransactionError } from "@solana/web3.js";

// Define types for Jupiter quote response
export interface QuoteResponseMeta {
  inAmount?: string;
  outAmount?: string;
  amount?: string;
  otherAmountThreshold?: string;
  swapMode?: string;
  priceImpactPct?: number;
  routes?: RouteInfo[]; // Array of route information
  contextSlot?: number;
  timeTaken?: number;
  quoteResponse?: any;
  original?: any;
}

// Define interface for route information
export interface RouteInfo {
  id?: string;
  label?: string;
  inputMint?: string;
  outputMint?: string;
  inAmount?: string;
  outAmount?: string;
  lpFee?: {
    amount?: string;
    mint?: string;
    pct?: number;
  };
  platformFee?: {
    amount?: string;
    mint?: string;
    pct?: number;
  };
  // Optional marketInfos field that might be used
  marketInfos?: Array<{
    lpFee?: string;
  }>;
}

// Define union type for SwapResult based on the error messages
export type SwapResult =
  | {
      txid: string;
      inputAddress: PublicKey;
      outputAddress: PublicKey;
      inputAmount: number;
      outputAmount: number;
    }
  | { error?: TransactionError }
  | { signature: string };

// Define the params for the exchange function
export interface ExchangeParams {
  userPublicKey?: PublicKey;
  wrapUnwrapSOL?: boolean;
  prioritizationFeeLamports?: number | "auto" | { autoMultiplier: number };
  quoteResponseMeta?: QuoteResponseMeta;
}
