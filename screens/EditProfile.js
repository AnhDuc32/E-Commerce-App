import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserType } from 'UserContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://${API_URL}:8000/profile/${userId}`);
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setPassword(response.data.user.password);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChanges = async () => {
    setLoading(true);

    try {
      await axios.put(`http://${API_URL}:8000/profile/${userId}`, {
        name,
        email,
        password,
      });

      Alert.alert('Profile updated successfully!');

      navigation.goBack();
    } catch (error) {
      console.error('Error updating user profile:', error);
      Alert.alert('Error updating profile', error.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mt-5 bg-white">
        <View className="h-14 bg-cus-blue" />

        <View className="p-3">
          <Text className="mt-5 text-center text-3xl font-bold">Edit Profile</Text>

          <View className="mt-10">
            <Text className="text-base font-bold">Full name (First and last name)</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your new Name"
              className="mt-3 border border-gray-300 p-3"
              placeholderTextColor="#c0c0c0"
            />
          </View>

          <View className="mt-3">
            <Text className="text-base font-bold">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your new Email"
              className="mt-3 border border-gray-300 p-3"
              placeholderTextColor="#c0c0c0"
            />
          </View>

          <View className="mt-3 flex-1">
            <Text className="text-base font-bold">Password</Text>

            <View className="gap-2">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isPasswordVisible}
                placeholder="Enter your new Password"
                className="mt-3 border border-gray-300 p-3"
                placeholderTextColor="#c0c0c0"
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={togglePasswordVisibility}
                className="absolute right-3 top-6">
                <MaterialCommunityIcons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={handleChanges}
            activeOpacity={0.7}
            className="mt-10 items-center justify-center rounded-lg bg-yellow-400 p-5">
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Text className="text-xl font-bold">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
