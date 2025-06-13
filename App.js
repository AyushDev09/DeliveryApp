import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import ProductListScreen from './ProductListScreen';
import SimpleMap from './Simplemap';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Products" component={ProductListScreen} />
        <Stack.Screen name="TrackOrder" component={SimpleMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
