import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { fetchXlmBalance, fetchTransactionsPage } from '../services/stellar';

const WALLET_KEY = 'pocketpay_wallet_secret';

/** Page size used when fetching transaction pages from Horizon. */
const TX_PAGE_SIZE = 20;

export interface TransactionRecord {
  id: string;
  type: string;
  created_at: string;
  source_account?: string;
  to?: string;
  from?: string;
  amount?: string;
  asset_type?: string;
  /** Horizon paging token — used as the cursor for load-more. */
  paging_token?: string;
}

interface WalletState {
  publicKey: string | null;
  balance: string;
  transactions: TransactionRecord[];
  isLoading: boolean;
  /** True only while loading additional (older) pages. */
  isLoadingMore: boolean;
  /** Whether there are older transactions still available to fetch. */
  hasMoreTransactions: boolean;
  /** Cursor to pass when fetching the next page (oldest paging_token seen). */
  nextCursor: string | null;
  error: string | null;

  // Actions
  setWallet: (publicKey: string, secretKey: string) => Promise<void>;
  loadWalletFromStorage: () => Promise<boolean>;
  /** Pull-to-refresh: resets pagination and loads the first page fresh. */
  refreshWalletData: () => Promise<void>;
  /** Load-more: appends the next page of older transactions. */
  loadMoreTransactions: () => Promise<void>;
  clearWallet: () => Promise<void>;
  getSecretKey: () => Promise<string | null>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  balance: '0.0000000',
  transactions: [],
  isLoading: false,
  isLoadingMore: false,
  hasMoreTransactions: false,
  nextCursor: null,
  error: null,

  setWallet: async (publicKey: string, secretKey: string) => {
    try {
      await SecureStore.setItemAsync(WALLET_KEY, secretKey);
      set({
        publicKey,
        balance: '0.0000000',
        transactions: [],
        nextCursor: null,
        hasMoreTransactions: false,
        error: null,
      });
    } catch (err) {
      console.error('Failed to save wallet securely:', err);
      set({ error: 'Failed to save wallet securely' });
    }
  },

  loadWalletFromStorage: async () => {
    try {
      const secretKey = await SecureStore.getItemAsync(WALLET_KEY);
      if (secretKey) {
        // Derive public key from secret to ensure consistency without storing it
        // separately in AsyncStorage.
        const StellarSdk = await import('@stellar/stellar-sdk');
        const keypair = StellarSdk.Keypair.fromSecret(secretKey);
        set({ publicKey: keypair.publicKey() });
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
      const [balance, page] = await Promise.all([
        fetchXlmBalance(publicKey),
        fetchTransactionsPage(publicKey, TX_PAGE_SIZE),
      ]);

      set({
        balance,
        transactions: page.records as TransactionRecord[],
        nextCursor: page.nextCursor,
        hasMoreTransactions: page.hasMore,
        isLoading: false,
      });
    } catch (err: any) {
      console.error('Failed to refresh wallet data:', err);
      set({ isLoading: false, error: err.message || 'Failed to sync data' });
    }
  },

  loadMoreTransactions: async () => {
    const { publicKey, isLoadingMore, hasMoreTransactions, nextCursor, transactions } = get();

    // Guard: nothing to do if already loading or no more pages.
    if (!publicKey || isLoadingMore || !hasMoreTransactions || !nextCursor) return;

    set({ isLoadingMore: true, error: null });
    try {
      const page = await fetchTransactionsPage(publicKey, TX_PAGE_SIZE, nextCursor);

      // Deduplicate: build a set of existing IDs then filter the new records.
      const existingIds = new Set(transactions.map((tx) => tx.id));
      const newRecords = (page.records as TransactionRecord[]).filter(
        (tx) => !existingIds.has(tx.id)
      );

      set({
        transactions: [...transactions, ...newRecords],
        nextCursor: page.nextCursor,
        hasMoreTransactions: page.hasMore,
        isLoadingMore: false,
      });
    } catch (err: any) {
      console.error('Failed to load more transactions:', err);
      set({ isLoadingMore: false, error: err.message || 'Failed to load more' });
    }
  },

  clearWallet: async () => {
    try {
      await SecureStore.deleteItemAsync(WALLET_KEY);
      set({
        publicKey: null,
        balance: '0.0000000',
        transactions: [],
        nextCursor: null,
        hasMoreTransactions: false,
        error: null,
      });
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
  },
}));
