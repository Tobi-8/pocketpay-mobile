import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useWalletStore, TransactionRecord } from '../../src/store/walletStore';
import { COLORS, SIZES, RADIUS } from '../../src/constants/theme';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react-native';

export default function HistoryScreen() {
  const { transactions, isLoading, refreshWalletData, publicKey } = useWalletStore();

  useEffect(() => {
    refreshWalletData();
  }, []);

  const renderItem = ({ item }: { item: TransactionRecord }) => {
    // Basic logic to determine if it's sent or received
    // In a real app with more complex ops, this would be more robust
    const isSent = item.source_account === publicKey || item.from === publicKey;

    return (
      <View style={styles.txItem}>
        <View style={[styles.txIcon, { backgroundColor: isSent ? 'rgba(255, 61, 0, 0.1)' : 'rgba(0, 230, 118, 0.1)' }]}>
          {isSent ? <ArrowUpRight color={COLORS.error} /> : <ArrowDownLeft color={COLORS.success} />}
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txType}>{isSent ? 'Sent XLM' : 'Received XLM'}</Text>
          <Text style={styles.txDate}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
        <Text style={[styles.txAmount, { color: isSent ? COLORS.textPrimary : COLORS.success }]}>
          {isSent ? '-' : '+'}{item.amount || '0'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshWalletData} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Clock color={COLORS.textMuted} size={64} style={{ marginBottom: SIZES.md }} />
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubtext}>Your recent activity will appear here.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.lg,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.lg,
    borderRadius: RADIUS.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  txInfo: {
    flex: 1,
  },
  txType: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  txDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: SIZES.xl,
    alignItems: 'center',
    marginTop: SIZES.xxl * 2,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  }
});
