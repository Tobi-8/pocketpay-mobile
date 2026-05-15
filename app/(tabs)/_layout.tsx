import { Tabs } from 'expo-router';
import { Home, History, PiggyBank, Settings } from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.background,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: COLORS.textPrimary,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      sceneStyle: {
        backgroundColor: COLORS.background,
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="vault" 
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, size }) => <PiggyBank color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />
        }} 
      />
    </Tabs>
  );
}
