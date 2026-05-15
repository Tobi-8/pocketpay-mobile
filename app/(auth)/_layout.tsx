import { Stack } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.background,
      },
      headerTintColor: COLORS.textPrimary,
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: COLORS.background,
      }
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ title: 'Create Wallet' }} />
      <Stack.Screen name="import" options={{ title: 'Import Wallet' }} />
    </Stack>
  );
}
