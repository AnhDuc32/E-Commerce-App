import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from 'screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ProductInfo from 'screens/ProductInfo';
import AddAddress from 'screens/AddAddress';
import Address from 'screens/Address';
import Cart from 'screens/Cart';
import Profile from 'screens/Profile';
import Confirmation from 'screens/Confirmation';
import Order from 'screens/Order';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const BottomTab = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: { color: '#0096c7' },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="home" size={24} color="#0096c7" />
              ) : (
                <Ionicons name="home-outline" size={24} color="#0096c7" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarLabelStyle: { color: '#0096c7' },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#0096c7" />
              ) : (
                <Ionicons name="person-outline" size={24} color="#0096c7" />
              ),
          }}
        />

        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            tabBarLabel: 'Cart',
            tabBarLabelStyle: { color: '#0096c7' },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="cart" size={24} color="#0096c7" />
              ) : (
                <Ionicons name="cart-outline" size={24} color="#0096c7" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />

        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />

        <Stack.Screen name="Main" component={BottomTab} options={{ headerShown: false }} />

        <Stack.Screen name="Info" component={ProductInfo} options={{ headerShown: false }} />

        <Stack.Screen name="Address" component={AddAddress} options={{ headerShown: false }} />

        <Stack.Screen name="Add" component={Address} options={{ headerShown: false }} />

        <Stack.Screen name="Confirm" component={Confirmation} options={{ headerShown: false }} />

        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
