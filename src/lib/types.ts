
import { PublicKey } from "@solana/web3.js";

// Auth context types
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  publicKey: PublicKey | null;
  passkey: PasskeyInfo | null;
  register: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

export interface PasskeyInfo {
  id: string;
  publicKey: string;
}

// Transaction types
export interface Transaction {
  id: string;
  type: 'swap' | 'transfer' | 'other';
  timestamp: number;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  fromToken?: string;
  toToken?: string;
  fromAmount?: string;
  toAmount?: string;
}

// Token types
export interface Token {
  symbol: string;
  name: string;
  mint: string;
  logo?: string;
  balance?: string;
  usdValue?: number;
}

// For WebAuthn types that TypeScript might not recognize
declare global {
  interface PublicKeyCredentialCreationOptions {
    challenge: BufferSource;
    rp: PublicKeyCredentialRpEntity;
    user: PublicKeyCredentialUserEntity;
    pubKeyCredParams: PublicKeyCredentialParameters[];
    timeout?: number;
    excludeCredentials?: PublicKeyCredentialDescriptor[];
    authenticatorSelection?: AuthenticatorSelectionCriteria;
    attestation?: AttestationConveyancePreference;
    extensions?: AuthenticationExtensionsClientInputs;
  }

  // Remove the inconsistency by using a single declaration approach
  interface AuthenticatorResponse {
    // Remove the duplicate getPublicKey declaration
  }

  interface AuthenticatorAttestationResponse extends AuthenticatorResponse {
    getPublicKey(): ArrayBuffer | null;
  }
}
