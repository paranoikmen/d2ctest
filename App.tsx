/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './app/navigation/AppNavigator';

// Создаем кастомную тему для Paper
const theme = {
  ...MD3LightTheme,
  // Явно указываем версию 3
  version: 3 as const, 
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3f51b5',
    accent: '#f1c40f',
  },
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
