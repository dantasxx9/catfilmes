import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import { colors, headingFont } from './theme';

SplashScreen.preventAutoHideAsync().catch(() => {});
const Stack = createNativeStackNavigator();
const navigationTheme = { ...DarkTheme, colors: { ...DarkTheme.colors,
  background: colors.background, card: colors.surface, text: colors.text, primary: colors.accent, border: colors.border } };

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ SpaceGrotesk_700Bold });
  useEffect(() => { if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {}); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;
  return <SafeAreaProvider>
    <StatusBar style="light" />
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.accent, headerTitleStyle: { fontFamily: fontsLoaded ? headingFont : undefined },
        contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'CatFilmes', headerShadowVisible: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: route.params?.title ?? 'Detalhes' })} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>;
}
