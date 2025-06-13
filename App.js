import React from 'react';
import LoginScreen from './LoginScreen';
import ProductListScreen from './ProductListScreen';
import OrderTrackingScreen from './OrderTrackingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Products">
        <Stack.Screen name="Products" component={ProductListScreen} />
        <Stack.Screen name="TrackOrder" component={OrderTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}