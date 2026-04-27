import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerBackTitle: 'Retour',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="category/[id]" options={{ title: 'Catégorie' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Détails de la F1' }} />
        <Stack.Screen name="create-order" options={{ title: 'Nouvelle commande' }} />
        <Stack.Screen name="order/[id]" options={{ title: 'Facture' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
