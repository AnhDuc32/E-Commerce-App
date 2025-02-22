import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { UserType } from 'UserContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@env';

const Address = () => {
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const handleAddAddress = () => {
    const address = {
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };

    axios
      .post(`http://${API_URL}:8000/addresses`, { userId, address })
      .then((response) => {
        Alert.alert('Success', 'Addresses added successfully');
        setName('');
        setMobileNo('');
        setHouseNo('');
        setStreet('');
        setLandmark('');
        setPostalCode('');

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to add Address');
        console.log('Error: ', error);
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mt-5 bg-white">
        <View className="h-14 bg-cus-blue" />

        <View className="p-3">
          <Text className="text-lg font-bold">Add a new Address</Text>

          <TextInput
            placeholderTextColor={'black'}
            placeholder="Vietnam"
            className="mt-3 rounded-md border border-gray-300 p-3"
          />

          <View className="mt-3">
            <Text className="text-base font-bold">Full name (First and last name)</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your Name"
              className="mt-3 border border-gray-300 p-3"
            />
          </View>

          <View className="mt-3">
            <Text className="text-base font-bold">Mobile number</Text>
            <TextInput
              value={mobileNo}
              onChangeText={setMobileNo}
              placeholder="Enter your Mobile number"
              className="mt-3 border border-gray-300 p-3"
            />
          </View>

          <View className="mt-3">
            <Text className="text-base font-bold">Flat, House, No, Building, Company</Text>
            <TextInput
              value={houseNo}
              onChangeText={setHouseNo}
              placeholder="e.g. No 5"
              className="mt-3 border border-gray-300 p-3"
            />
          </View>

          <View className="mt-3">
            <Text className="text-base font-bold">Area, Street, Sector, Village</Text>
            <TextInput
              value={street}
              onChangeText={setStreet}
              placeholder="e.g. Nghia Tan street"
              className="mt-3 border border-gray-300 p-3"
            />
          </View>

          <View className="mt-3">
            <Text className="text-base font-bold">Landmark</Text>
            <TextInput
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g. Near Landmark 72"
              className="mt-3 border border-gray-300 p-3"
            />
          </View>

          <View className="mt-3">
            <Text className="text-base font-bold">Pincode</Text>
            <TextInput
              value={postalCode}
              onChangeText={setPostalCode}
              placeholder="Enter your Pincode"
              className="mt-3 border border-gray-300 p-3"
            />
          </View>

          <TouchableOpacity
            onPress={handleAddAddress}
            activeOpacity={0.7}
            className="mt-5 items-center justify-center rounded-lg bg-yellow-400 p-5">
            <Text className="font-bold">Add Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({});
