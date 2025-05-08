
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, RefreshCw, Copy, AlertCircle } from "lucide-react";
import { TokenSelect } from "@/components/TokenSelect";

interface SwapFormProps {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  setFromToken: (symbol: string) => void;
  setToToken: (symbol: string) => void;
  setFromAmount: (amount: string) => void;
  switchTokens: () => void;
  onSwap: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  jupLoading: boolean;
  price: number | null;
  routes: any[];
  MAINNET_TOKENS: any[];
  publicKey: string | null;
  handleCopyAddress: () => void;
  refreshPrice?: () => void;
  error?: string | null;
  tokenBalances?: {[key: string]: string};
}

export function SwapForm(props: SwapFormProps) {
  const {
    fromToken, toToken, fromAmount, setFromToken, setToToken, setFromAmount,
    switchTokens, onSwap, isLoading, isAuthenticated, jupLoading,
    price, routes, MAINNET_TOKENS, publicKey, handleCopyAddress, refreshPrice,
    error, tokenBalances = {}
  } = props;

  // Calculate the estimated amount
  const estimatedAmount = price && fromAmount && !isNaN(Number(fromAmount))
    ? (Number(fromAmount) * (price || 0)).toFixed(4)
    : "";

  // Get token balances or display placeholder
  const fromTokenBalance = tokenBalances[fromToken] || "--";
  const toTokenBalance = tokenBalances[toToken] || "--";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Real-time swaps on Solana via Jupiter Aggregator</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated && publicKey && (
          <div className="flex items-center gap-2 text-xs bg-muted p-2 rounded">
            <span className="truncate">{publicKey}</span>
            <Button size="icon" variant="outline" onClick={handleCopyAddress} title="Copy address">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>From</span>
            <span className="text-muted-foreground">Balance: {fromTokenBalance} {fromToken}</span>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="0.00"
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              min="0"
            />
            <TokenSelect
              tokens={MAINNET_TOKENS}
              value={fromToken}
              onChange={setFromToken}
              exclude={toToken}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={switchTokens}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>To</span>
            <span className="text-muted-foreground">Balance: {toTokenBalance} {toToken}</span>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder={jupLoading ? "Loading..." : "0.00"}
              readOnly
              value={estimatedAmount}
            />
            <TokenSelect
              tokens={MAINNET_TOKENS}
              value={toToken}
              onChange={setToToken}
              exclude={fromToken}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded text-sm flex items-start gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {fromAmount && !error && (
          <div className="bg-muted p-3 rounded text-sm space-y-2">
            <div className="flex justify-between">
              <span>Rate</span>
              <div className="flex items-center gap-1">
                <span>1 {fromToken} = {price?.toFixed(4) ?? "--"} {toToken}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-5 w-5" 
                  onClick={() => refreshPrice?.()} 
                  title="Refresh price"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {routes?.[0] && (
              <div className="flex justify-between">
                <span>Fee</span>
                <span>
                  {routes[0]?.marketInfos?.[0]?.lpFee
                    ? `${(Number(routes[0].marketInfos[0].lpFee) * 100).toFixed(2)}%` : "--"}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Route</span>
              <span className="flex items-center gap-1">
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">Jupiter</span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-solana-purple to-solana-mint hover:opacity-90 transition-opacity"
          onClick={onSwap}
          disabled={isLoading || jupLoading || !fromAmount || Number(fromAmount) <= 0}
        >
          {isLoading ? "Swapping..." : (isAuthenticated ? "Swap" : "Connect & Swap")}
        </Button>
      </CardFooter>
    </Card>
  );
}
