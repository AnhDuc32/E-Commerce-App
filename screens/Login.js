import {
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setLoading(false);

        if (token) {
          navigation.replace('Main');
        }
      } catch (error) {
        console.log('Error message', error);
      }
    };
    checkLoginStatus();
  }, []);

  if (loading && AsyncStorage.getItem('authToken')) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" color="#0000ff" />
        <Image
          source={require('../assets/e_commerce_logo-removebg-preview.png')}
          className="h-44 w-44"
          style={{ resizeMode: 'contain' }}
        />
      </View>
    )
  }

  const toggleRememberMe = () => {
    setIsRemembered(!isRemembered);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogIn = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post(`http://${API_URL}:8000/login`, user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem('authToken', token);
        navigation.replace('Main');
      })
      .catch((error) => {
        Alert.alert('Login error', 'Invalid email or password');
        console.log(error);
      });
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white p-10">
      <View className="mt-20">
        <Image source={require('../assets/e_commerce_logo.png')} className="h-32 w-32" />
      </View>

      <KeyboardAvoidingView>
        <View className="mt-10 items-center">
          <Text className="text-2xl font-bold">Log In</Text>
        </View>

        <View className="mt-16 w-full flex-row items-center gap-2">
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

        <View className="mt-7 flex-row justify-between">
          <TouchableOpacity
            onPress={toggleRememberMe}
            activeOpacity={0.7}
            className="flex-row items-center gap-1">
            <View
              className={`h-5 w-5 rounded-md border
              ${isRemembered ? 'bg-blue-500' : 'bg-white'}`}>
              {isRemembered && <MaterialCommunityIcons name="check" size={15} color="white" />}
            </View>
            <Text>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-blue-500 underline">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-32" />

        <TouchableOpacity
          onPress={handleLogIn}
          activeOpacity={0.7}
          className="m-auto w-[200px] items-center rounded-3xl bg-blue-500 p-3">
          <Text className="text-xl font-bold text-white">Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
          <Text className="mt-5 text-center text-blue-500">Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
