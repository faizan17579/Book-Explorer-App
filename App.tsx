import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen, RootStackParamList } from './src/screens/HomeScreen';
import { BookDetailScreen } from './src/screens/BookDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#f5f5f5', paddingTop: 56 },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={({ navigation }) => ({
            title: 'Book Detail',
            headerBackTitle: 'Back',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={{ padding: 10 }}
              >
                <Text style={{ fontSize: 18 }}>🔍</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
