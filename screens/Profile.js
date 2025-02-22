import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { API_URL } from '@env';
import { UserType } from 'UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation = useNavigation();

  const { userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: '#a0e4ff',
      },
      headerLeft: () => (
        <Image
          source={require('../assets/e_commerce_logo-removebg-preview.png')}
          style={{ width: 100, height: 80, resizeMode: 'contain' }}
        />
      ),
      headerRight: () => (
        <View className="mr-3 flex-row items-center gap-1">
          <AntDesign name="search1" size={24} color="black" />

          <Ionicons name="notifications-outline" size={24} color="black" />
        </View>
      ),
    });
  }, []);

  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserPrfile = async () => {
      try {
        const response = await axios.get(`http://${API_URL}:8000/profile/${userId}`);

        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    fetchUserPrfile();
  }, []);

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('Auth token cleared successfully! Redirecting to login screen...');
    navigation.navigate('Login');
  };

  const logOut = () => {
    clearAuthToken();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://${API_URL}:8000/orders/${userId}`);
        const orders = response.data.order;
        setOrders(orders);

        setLoading(false);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-3">
      <Text className="font-bold">Welcome {user?.name}</Text>

      <View className="mt-3 flex-row items-center gap-2">
        <TouchableOpacity className="flex-1 rounded-3xl bg-gray-200 p-3" activeOpacity={0.7}>
          <Text className="text-center">Your Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 rounded-3xl bg-gray-200 p-3" activeOpacity={0.7}>
          <Text className="text-center">Your Account</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <TouchableOpacity className="flex-1 rounded-3xl bg-gray-200 p-3" activeOpacity={0.7}>
          <Text className="text-center">Buy Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logOut}
          className="flex-1 rounded-3xl bg-gray-200 p-3"
          activeOpacity={0.7}>
          <Text className="text-center">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
