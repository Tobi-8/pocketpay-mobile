import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { Button } from '../src/components/Button';
import { COLORS, SIZES, RADIUS } from '../src/constants/theme';
import { useWalletStore } from '../src/store/walletStore';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function ReceiveScreen() {
  const { publicKey } = useWalletStore();

  const handleCopy = async () => {
    if (publicKey) {
      await Clipboard.setStringAsync(publicKey);
    }
  };

  const handleShare = async () => {
    if (publicKey) {
      await Share.share({
        message: publicKey,
        title: 'My Stellar Address'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Receive XLM</Text>
        <Text style={styles.subtitle}>Show this QR code to receive payments on the Stellar Testnet.</Text>
      </View>

      <View style={styles.qrContainer}>
        {publicKey ? (
          <QRCode
            value={publicKey}
            size={250}
            color={COLORS.background}
            backgroundColor={COLORS.textPrimary}
          />
        ) : (
          <Text style={{ color: COLORS.textMuted }}>No public key found</Text>
        )}
      </View>

      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Your Public Key</Text>
        <View style={styles.addressBox}>
          <Text style={styles.addressText} selectable>{publicKey}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button 
          title="Copy Address" 
          onPress={handleCopy} 
          style={styles.actionButton}
        />
        <Button 
          title="Share" 
          variant="secondary"
          onPress={handleShare} 
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.xl,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: SIZES.xl,
    marginTop: SIZES.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  qrContainer: {
    backgroundColor: COLORS.textPrimary,
    padding: SIZES.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SIZES.xl,
  },
  addressContainer: {
    width: '100%',
    marginBottom: SIZES.xl,
  },
  addressLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  addressBox: {
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.xs,
  }
});
