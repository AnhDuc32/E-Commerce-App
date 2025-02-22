import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserType } from 'UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@env';

const AddAddress = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://${API_URL}:8000/addresses/${userId}`);
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="mt-5 bg-white">
        <View className="flex-row items-center gap-4 bg-cus-blue p-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-1 flex-row items-center gap-2 rounded-sm bg-white">
            <Ionicons name="search-outline" size={24} color="black" className="ml-4" />
            <TextInput placeholder="Search Location" />
          </TouchableOpacity>

          <Ionicons name="mic-sharp" size={24} color="black" />
        </View>

        <View className="p-3">
          <Text className="text-xl font-bold">Your Addresses</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Add')}
            className="mt-3 flex-row items-center justify-between border border-l-0 border-r-0 border-gray-300 px-1 py-2"
            activeOpacity={0.7}>
            <Text>Add a new Address</Text>

            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            {addresses.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                className="my-3 flex-col gap-1 rounded-sm border border-gray-300 p-3">
                <View className="flex-row items-center gap-1">
                  <Text className="text-base font-bold">{item.name}</Text>

                  <Ionicons name="location-sharp" size={24} color="red" />
                </View>

                <Text className="text-base text-gray-600">
                  {item.houseNo}, {item.landmark}
                </Text>

                <Text className="text-gray-600">{item.street}</Text>

                <Text className="text-gray-600">Hanoi, Vietnam</Text>

                <Text className="text-gray-600">Phone No : {item.mobileNo}</Text>

                <Text className="text-gray-600">Pin code : {item.postalCode}</Text>

                <View className="mt-2 flex-row items-center gap-3">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="rounded-md border border-gray-300 px-3 py-2">
                    <Text>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="rounded-md border border-gray-300 px-3 py-2">
                    <Text>Remove</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="rounded-md border border-gray-300 px-3 py-2">
                    <Text>Set as Default</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({});
