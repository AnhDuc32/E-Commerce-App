import {
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '@env';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSignUp = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    // Send a POST request to the server
    axios
      .post(`http://${API_URL}:8000/signup`, user)
      .then((response) => {
        console.log('Response received:', response.data);
        Alert.alert(
          'Sign Up Successful',
          'You have signed up successfully. Please check your email for verification.'
        );
        setName('');
        setPassword('');
        setEmail('');
        setConfirmPassword('');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.log('Sign Up failed:', error); // Log full error object
        console.log('Error response:', error.response?.data); // Log server error message
        Alert.alert('Sign Up Failed', error.response?.data?.error || 'Failed to sign up');
      });
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white p-10">
      <View className="mt-20">
        <Image source={require('../assets/e_commerce_logo.png')} className="h-32 w-32" />
      </View>

      <KeyboardAvoidingView>
        <View className="mt-10 items-center">
          <Text className="text-2xl font-bold">Sign Up</Text>
        </View>

        <View className="mt-16 w-full flex-row items-center gap-2">
          <MaterialIcons name="person" size={24} color="gray" />

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Enter your Name"
            className="w-full border-b border-gray-400"
            placeholderTextColor="#c0c0c0"
          />
        </View>

        <View className="mt-7 w-full flex-row items-center gap-2">
          <MaterialIcons name="email" size={24} color="gray" />

          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your Email"
            className="w-full border-b border-gray-400"
            placeholderTextColor="#c0c0c0"
          />
        </View>

        <View className="mt-7 w-full flex-row items-center gap-2">
          <AntDesign name="lock" size={24} color="gray" />

          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={isPasswordVisible}
            placeholder="Enter your Password"
            className="w-full border-b border-gray-400"
            placeholderTextColor="#c0c0c0"
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={togglePasswordVisibility}
            className="absolute right-0">
            <MaterialCommunityIcons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-7 w-full flex-row items-center gap-2">
          <AntDesign name="lock" size={24} color="gray" />

          <TextInput
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={isConfirmPasswordVisible}
            placeholder="Confirm your Password"
            className="w-full border-b border-gray-400"
            placeholderTextColor="#c0c0c0"
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleConfirmPasswordVisibility}
            className="absolute right-0">
            <MaterialCommunityIcons
              name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-32" />

        <TouchableOpacity
          onPress={handleSignUp}
          activeOpacity={0.7}
          className="m-auto w-[200px] items-center rounded-3xl bg-blue-500 p-3">
          <Text className="text-xl font-bold text-white">Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text className="mt-5 text-center text-blue-500">Already have an account? Log In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
