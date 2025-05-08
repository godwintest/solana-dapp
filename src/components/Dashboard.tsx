
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Transaction } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy } from "lucide-react";

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "swap",
    timestamp: Date.now() - 3600000,
    amount: "0.5",
    status: "confirmed",
    fromToken: "SOL",
    toToken: "USDC",
    fromAmount: "0.5",
    toAmount: "10.25"
  },
  {
    id: "tx2",
    type: "transfer",
    timestamp: Date.now() - 7200000,
    amount: "10",
    status: "confirmed"
  },
  {
    id: "tx3",
    type: "swap",
    timestamp: Date.now() - 86400000,
    amount: "1.2",
    status: "confirmed",
    fromToken: "USDC",
    toToken: "SOL",
    fromAmount: "25",
    toAmount: "1.2"
  }
];

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export function Dashboard() {
  const { publicKey, passkey } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("assets");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      toast({
        title: "Address copied",
        description: "Your wallet address has been copied to clipboard"
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Overview</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            <div className="mt-4 h-[60px] w-full bg-gradient-to-r from-solana-purple to-solana-mint opacity-30 rounded"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Account</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            {publicKey ? (
              <>
                <div className="text-sm font-semibold mb-1">Passkey-Generated Address:</div>
                <div className="flex items-center">
                  <div className="truncate text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded break-all flex-1">
                    {publicKey.toString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={copyAddress}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">SOL Balance</p>
                    <p className="font-medium">2.5 SOL</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">USDC Balance</p>
                    <p className="font-medium">50.00 USDC</p>
                  </div>
                </div>
                {passkey && (
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Secured with passkey ID: {passkey.id.substring(0, 8)}...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Connect with passkey to view your account
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-solana-gradient" />
                    <span>Solana</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">2.5 SOL</div>
                    <div className="text-sm text-muted-foreground">$100.00</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs text-green-700">$</span>
                    </div>
                    <span>USDC</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">50.00 USDC</div>
                    <div className="text-sm text-muted-foreground">$50.00</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">
                        {tx.type === 'swap' ? 
                          `Swap ${tx.fromAmount} ${tx.fromToken} → ${tx.toAmount} ${tx.toToken}` : 
                          `Transfer ${tx.amount} ${tx.type === 'transfer' ? 'SOL' : ''}`
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(tx.timestamp)}
                      </div>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      tx.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium mb-1">Recipient Address</label>
                  <input 
                    id="recipient" 
                    className="w-full p-2 border rounded" 
                    placeholder="Enter Solana address"
                  />
                </div>
                
                <div>
                  <label htmlFor="sendToken" className="block text-sm font-medium mb-1">Token</label>
                  <select id="sendToken" className="w-full p-2 border rounded">
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                    <option value="BONK">BONK</option>
                    <option value="RAY">RAY</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                  <input 
                    id="amount" 
                    type="number" 
                    className="w-full p-2 border rounded" 
                    placeholder="0.0"
                    min="0"
                    step="0.000001"
                  />
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-solana-purple to-solana-mint hover:opacity-90 transition-opacity"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receive Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center rounded">
                    <div className="text-xs">QR Code Placeholder</div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Your Address</p>
                  <div className="flex">
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded break-all text-sm">
                      {publicKey ? publicKey.toString() : "Connect wallet to view address"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={copyAddress}
                      disabled={!publicKey}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 text-center">
                  Send SOL or SPL tokens to this address
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
