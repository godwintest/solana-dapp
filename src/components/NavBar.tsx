
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function NavBar() {
  const { isAuthenticated, publicKey, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <nav className="py-4 border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-solana-gradient animate-pulse-glow"></div>
          <span className="font-bold text-lg bg-gradient-to-r from-solana-purple to-solana-mint bg-clip-text text-transparent">
            SolanaVerse
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:text-solana-purple transition-colors">
            Swap
          </a>
          <a href="#" className="hover:text-solana-purple transition-colors">
            Dashboard
          </a>
        </div>

        <div className="hidden md:block">
          {isAuthenticated && publicKey ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 border rounded-full text-sm font-medium flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>{formatAddress(publicKey.toString())}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                disabled={isLoading}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="invisible">Placeholder</div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b z-20">
          <div className="container mx-auto py-4 space-y-4">
            <a href="#" className="block hover:text-solana-purple transition-colors py-2">
              Swap
            </a>
            <a href="#" className="block hover:text-solana-purple transition-colors py-2">
              Dashboard
            </a>
            {isAuthenticated && publicKey && (
              <div className="pt-2 border-t">
                <div className="mb-2 text-sm font-medium">
                  {formatAddress(publicKey.toString())}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  disabled={isLoading}
                  className="w-full"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
