import "@walletconnect/react-native-compat";

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { appKit } from '@/config/AppKitConfig';
import { AppKit, AppKitProvider } from '@reown/appkit-react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppKitProvider instance={appKit}>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="payment/index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
          <AppKit />
        </ThemeProvider>
      </AppKitProvider>
    </SafeAreaProvider>
  );
}
