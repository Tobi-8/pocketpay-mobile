import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { getPublicKey, type PaymentRecord } from 'pocketpay-sdk';
import { fetchXlmBalance, fetchRecentTransactions } from '../services/stellar';

const WALLET_KEY = 'pocketpay_wallet_secret';

export type TransactionRecord = PaymentRecord;

interface WalletState {
  publicKey: string | null;
  balance: string;
  transactions: TransactionRecord[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setWallet: (publicKey: string, secretKey: string) => Promise<void>;
  loadWalletFromStorage: () => Promise<boolean>;
  refreshWalletData: () => Promise<void>;
  clearWallet: () => Promise<void>;
  getSecretKey: () => Promise<string | null>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  balance: '0.0000000',
  transactions: [],
  isLoading: false,
  error: null,

  setWallet: async (publicKey: string, secretKey: string) => {
    try {
      await SecureStore.setItemAsync(WALLET_KEY, secretKey);
      set({ publicKey, balance: '0.0000000', transactions: [], error: null });
    } catch (err) {
      console.error('Failed to save wallet securely:', err);
      set({ error: 'Failed to save wallet securely' });
    }
  },

  loadWalletFromStorage: async () => {
    try {
      const secretKey = await SecureStore.getItemAsync(WALLET_KEY);
      if (secretKey) {
        set({ publicKey: getPublicKey(secretKey) });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to load wallet from storage:', err);
      return false;
    }
  },

  refreshWalletData: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    set({ isLoading: true, error: null });
    try {
      const [balance, txs] = await Promise.all([
        fetchXlmBalance(publicKey),
        fetchRecentTransactions(publicKey),
      ]);
      set({ balance, transactions: txs, isLoading: false });
    } catch (err: any) {
      console.error('Failed to refresh wallet data:', err);
      set({ isLoading: false, error: err.message || 'Failed to sync data' });
    }
  },

  clearWallet: async () => {
    try {
      await SecureStore.deleteItemAsync(WALLET_KEY);
      set({ publicKey: null, balance: '0.0000000', transactions: [], error: null });
    } catch (err) {
      console.error('Failed to clear wallet:', err);
    }
  },

  getSecretKey: async () => {
    try {
      return await SecureStore.getItemAsync(WALLET_KEY);
    } catch (err) {
      console.error('Failed to get secret key:', err);
      return null;
    }
  }
}));
