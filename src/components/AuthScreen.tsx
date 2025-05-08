
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export function AuthScreen() {
  const { register, login, isLoading } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-md w-full p-6 space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto h-24 w-24 rounded-full bg-solana-gradient animate-pulse-glow flex items-center justify-center"
          >
            <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-solana-purple"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-3xl font-bold tracking-tight"
          >
            Welcome to SolanaVerse
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-2 text-gray-500 dark:text-gray-400"
          >
            Sign in with your passkey to access the Solana ecosystem
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <Button
            className="w-full bg-gradient-to-r from-solana-purple to-solana-mint hover:opacity-90 transition-opacity"
            onClick={login}
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login with Passkey"}
          </Button>
          
          <div className="text-center pt-2">
            <span className="text-sm text-gray-500">
              Don't have a passkey?{" "}
              <Button variant="link" className="p-0" onClick={register} disabled={isLoading}>
                Register
              </Button>
            </span>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-6">
            Your passkey provides secure authentication without seed phrases.
            Powered by Lazorkit on Solana.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
