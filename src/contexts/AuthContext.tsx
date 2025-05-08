
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PublicKey } from "@solana/web3.js";
import { AuthContextType, PasskeyInfo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { registerPasskey, authenticateWithPasskey } from '@/lib/lazorkit';

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [passkey, setPasskey] = useState<PasskeyInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Register function using LazorKit
  const register = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use LazorKit SDK to register a new passkey
      const { passkeyInfo, publicKey: derivedPublicKey } = await registerPasskey();
      
      // Check if registration was completed or canceled
      if (!passkeyInfo || !passkeyInfo.id || passkeyInfo.id === "demo-passkey-id") {
        // If using demo mode for development, we allow this to work
        if (window.location.hostname.includes('lovableproject.com')) {
          setPasskey(passkeyInfo);
          setPublicKey(derivedPublicKey);
          setIsAuthenticated(true);
          
          toast({
            title: "Demo mode registration",
            description: `Using demo passkey. Your Solana address: ${derivedPublicKey.toString().slice(0, 8)}...`,
          });
          return;
        }
        
        throw new Error("Passkey registration was canceled or failed");
      }
      
      setPasskey(passkeyInfo);
      setPublicKey(derivedPublicKey);
      setIsAuthenticated(true);
      
      toast({
        title: "Registration successful",
        description: `Your passkey has been created. Your Solana address: ${derivedPublicKey.toString().slice(0, 8)}...`,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      
      toast({
        title: "Registration failed",
        description: err.message || 'An error occurred during registration',
        variant: "destructive",
      });
      throw err; // Rethrow to allow handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  // Login function using LazorKit
  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use LazorKit SDK to authenticate with an existing passkey
      const { passkeyInfo, publicKey: derivedPublicKey } = await authenticateWithPasskey();
      
      // Check if authentication was completed or canceled
      if (!passkeyInfo || !passkeyInfo.id || passkeyInfo.id === "demo-passkey-id") {
        // If using demo mode for development, we allow this to work
        if (window.location.hostname.includes('lovableproject.com')) {
          setPasskey(passkeyInfo);
          setPublicKey(derivedPublicKey);
          setIsAuthenticated(true);
          
          toast({
            title: "Demo mode login",
            description: `Using demo passkey. Your Solana address: ${derivedPublicKey.toString().slice(0, 8)}...`,
          });
          return;
        }
        
        throw new Error("Passkey authentication was canceled or failed");
      }
      
      setPasskey(passkeyInfo);
      setPublicKey(derivedPublicKey);
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: `You are now logged in. Your Solana address: ${derivedPublicKey.toString().slice(0, 8)}...`,
      });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      
      toast({
        title: "Login failed",
        description: err.message || 'An error occurred during login',
        variant: "destructive",
      });
      throw err; // Rethrow to allow handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setPublicKey(null);
    setPasskey(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      publicKey,
      passkey,
      register,
      login,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
