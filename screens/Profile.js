import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    setTimeout(() => {
      clearAuthToken();
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://${API_URL}:8000/orders/${userId}`);
        const orders = response.data.order;
        setOrders(orders);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    fetchOrders();
  }, []);

  const getUniqueProducts = (orders) => {
    const uniqueProducts = new Map();

    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (!uniqueProducts.has(product.name)) {
          uniqueProducts.set(product.name, product);
        }
      });
    });

    return Array.from(uniqueProducts.values());
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Image
          source={require('../assets/e_commerce_logo-removebg-preview.png')}
          className="h-44 w-44"
          style={{ resizeMode: 'contain' }}
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-3">
      <View className="mt-5 items-center">
        <Ionicons name="person-circle-outline" size={100} color="#0096c7" />

        <Text className="text-2xl font-bold">{user?.name}</Text>

        <Text className="font-medium text-gray-500">{user?.email}</Text>
      </View>

      <View className="mt-5 flex-1 gap-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-between rounded-3xl bg-gray-200 px-5 py-3"
          activeOpacity={0.7}>
          <Text>Edit Profile</Text>

          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-between rounded-3xl bg-gray-200 px-5 py-3"
          activeOpacity={0.7}
          onPress={logOut}>
          <Text>Log Out</Text>

          <Ionicons name="exit-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="mt-5">
        <Text className="text-xl font-bold">Buy Again</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-10 mt-5 flex-row flex-wrap items-center justify-center gap-4">
            {orders.length > 0 ? (
              getUniqueProducts(orders).map((product, index) => (
                <TouchableOpacity key={index} className="">
                  <View className="rounded-xl border border-gray-300 p-3">
                    <Image
                      source={{ uri: product.image }}
                      className="h-44 w-44"
                      style={{ resizeMode: 'contain' }}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="mt-20 text-xl text-gray-500">No orders found.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
