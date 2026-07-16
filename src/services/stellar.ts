import {
  createWallet,
  getBalance,
  getPayments,
  sendXLM,
  type PaymentRecord,
  type SDKConfig,
} from 'pocketpay-sdk';

const sdkConfig: Partial<SDKConfig> = {
  network: 'testnet',
  horizonUrl:
    process.env.EXPO_PUBLIC_STELLAR_HORIZON_URL ||
    'https://horizon-testnet.stellar.org',
};

/**
 * Generates a new Stellar Keypair.
 * This function returns both the public and secret keys.
 * The secret key MUST be stored securely using SecureStore.
 */
export const generateKeypair = createWallet;

/**
 * Fetch the XLM balance for a given public key.
 */
export const fetchXlmBalance = async (publicKey: string): Promise<string> => {
  try {
    const accountBalance = await getBalance(publicKey, sdkConfig);
    return accountBalance.nativeBalance;
  } catch (error: unknown) {
    // If account is not found (unfunded), balance is 0
    if (isAccountNotFoundError(error)) {
      return '0.0000000';
    }
    throw error;
  }
};

/**
 * Fetch recent transactions for a given public key.
 */
export const fetchRecentTransactions = async (
  publicKey: string,
  limit: number = 20
): Promise<PaymentRecord[]> => {
  try {
    const payments = await getPayments(publicKey, limit, 'desc', sdkConfig);
    return payments.records;
  } catch (error: unknown) {
    if (isAccountNotFoundError(error)) {
      return [];
    }
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Send XLM to a destination address.
 */
export const sendXlmTransaction = async (
  secretKey: string,
  destinationPublicKey: string,
  amount: string,
  memoText?: string
) => {
  return sendXLM(
    {
      sourceSecret: secretKey,
      destination: destinationPublicKey,
      amount,
      memo: memoText || undefined,
    },
    sdkConfig
  );
};

const isAccountNotFoundError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 'ACCOUNT_NOT_FOUND';

/**
 * MOCK SERVICE WRAPPERS FOR SOROBAN SAVINGS VAULT (Placeholder)
 * 
 * NOTE: Soroban smart contract interactions require specific contract bindings
 * or direct invocation via the SDK. These wrappers serve as placeholders for
 * where the actual Soroban SDK calls should be added.
 */

export const mockConnectVault = async (publicKey: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

export const mockFetchVaultBalance = async (publicKey: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return '0.0000000'; // Default placeholder
};

export const mockDepositToVault = async (secretKey: string, amount: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

export const mockWithdrawFromVault = async (secretKey: string, amount: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};
