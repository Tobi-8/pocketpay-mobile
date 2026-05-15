import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/Button';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import { Rocket } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Rocket color={COLORS.primary} size={80} />
        </View>
        <Text style={styles.title}>Stellar PocketPay</Text>
        <Text style={styles.subtitle}>
          Your gateway to the Stellar Network. Fast, secure, and easy to use.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Create New Wallet" 
          onPress={() => router.push('/(auth)/create')} 
          style={{ marginBottom: SIZES.md }}
        />
        <Button 
          title="Import Existing Wallet" 
          variant="outline"
          onPress={() => router.push('/(auth)/import')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xxl,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: SIZES.xl,
    paddingBottom: SIZES.xxl,
  },
});
