import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { UserType } from 'UserContext';
import { Entypo, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { cleanCart } from 'redux/CartReducer';
import RazorpayCheckout from 'react-native-razorpay';
import { API_URL } from '@env';
import { useStripe } from '@stripe/stripe-react-native';

const Confirmation = () => {
  const navigation = useNavigation();

  const steps = [
    { title: 'Address', content: 'Address Form' },
    { title: 'Delivery', content: 'Delivery Options' },
    { title: 'Payment', content: 'Payment Details' },
    { title: 'Place Order', content: 'Order Summary' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    .map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

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

  const dispatch = useDispatch();

  // console.log(addresses)

  const [selectedAddress, setSelectedAddress] = useState('');
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const response = await axios.post(`http://${API_URL}:8000/orders`, orderData);

      if (response.status === 200) {
        navigation.navigate('Order');
        dispatch(cleanCart());
        console.log('Order created successfully', response.data.order);
      } else {
        console.log('Error creating order: ', response.data);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const pay = async () => {
    try {
      // Convert the total price to cents
      const amountInCents = Math.floor(total * 100);

      // Fetch Payment Intent from the server
      const response = await axios.post(`http://${API_URL}:8000/create-payment-intent`, {
        amount: amountInCents,
        currency: 'USD',
      });

      if (!response.data.clientSecret) {
        Alert.alert('Payment Failed', 'Please try again.');
        console.log('Error: No client secret received from the server.');
        return;
      }

      const clientSecret = response.data.clientSecret;

      // Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Amazon',
      });

      if (initError) {
        Alert.alert('Payment Failed', 'Payment sheet initialization failed.');
        console.log('Error: Payment sheet initialization failed', initError);
        return;
      }

      // Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Payment Failed', 'Payment sheet presentation failed.');
        console.log('Error: Payment sheet presentation failed', paymentError);
        return;
      }

      // Payment successful and create Order
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: 'card',
      };

      const orderResponse = await axios.post(`http://${API_URL}:8000/orders`, orderData);

      if (orderResponse.status === 200) {
        navigation.navigate('Order');
        dispatch(cleanCart());
        console.log('Order created successfully', orderResponse.data.order);
      } else {
        console.log('Error creating order: ', orderResponse.data);
        Alert.alert('Payment Failed', 'Please try again.');
      }
    } catch (error) {
      console.log('Error: ', error);
      Alert.alert('Payment Failed', 'Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mt-5 bg-white">
        <View className="flex-1 px-5 py-10">
          <View className="flex-row items-center justify-between">
            {steps.map((step, index) => (
              <View className="items-center justify-center">
                {index > 0 && (
                  <View
                    className={`h-1 flex-1 ${index <= currentStep ? 'bg-green-500' : 'bg-green-500'}`}
                  />
                )}
                <View
                  className={`h-8 w-8 items-center justify-center rounded-2xl ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {index < currentStep ? (
                    <Text className="font-bold, text-white"> &#10003;</Text>
                  ) : (
                    <Text className="font-bold, text-white">{index + 1}</Text>
                  )}
                </View>

                <Text className="mt-2 text-center">{step.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {currentStep == 0 && (
          <View className="mx-5">
            <Text className="text-xl font-bold">Select Delivery Address</Text>

            <Pressable>
              {addresses.map((item, index) => (
                <Pressable className="my-2 flex-row items-center gap-1 rounded-md border border-gray-300 p-3 pb-4">
                  {selectedAddress && selectedAddress._id === item._id ? (
                    <FontAwesome5 name="dot-circle" size={24} color="green" />
                  ) : (
                    <Entypo
                      onPress={() => setSelectedAddress(item)}
                      name="circle"
                      size={24}
                      color="black"
                    />
                  )}

                  <View className="ml-2">
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

                    <View>
                      {selectedAddress && selectedAddress._id === item._id && (
                        <TouchableOpacity
                          onPress={() => setCurrentStep(1)}
                          className="mt-3 items-center justify-center rounded-3xl bg-cus-blue p-3"
                          activeOpacity={0.7}>
                          <Text className="text-center text-white">Deliver to this Address</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </Pressable>
          </View>
        )}

        {currentStep == 1 && (
          <View className="mx-5">
            <Text className="text-xl font-bold">Choose your Delivery Options</Text>

            <View className="mt-3 flex-row items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
              {option ? (
                <FontAwesome5 name="dot-circle" size={24} color="green" />
              ) : (
                <Entypo onPress={() => setOption(!option)} name="circle" size={24} color="black" />
              )}

              <Text className="flex-1">
                <Text className="font-medium text-green-500">Tomorrow by 10pm </Text>- FREE delivery
                with your Prime membership
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              activeOpacity={0.7}
              className="mt-5 items-center justify-center rounded-3xl bg-yellow-400 p-3">
              <Text>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep == 2 && (
          <View className="mx-5">
            <Text className="text-xl font-bold">Select your Payment Method</Text>

            <View className="mt-3 h-14 flex-row items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
              {selectedOption == 'cash' ? (
                <FontAwesome5 name="dot-circle" size={24} color="green" />
              ) : (
                <Entypo
                  onPress={() => setSelectedOption('cash')}
                  name="circle"
                  size={24}
                  color="black"
                />
              )}

              <Text>Cash on Delivery</Text>
            </View>

            <View className="mt-3 h-14 flex-row items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
              {selectedOption == 'card' ? (
                <FontAwesome5 name="dot-circle" size={24} color="green" />
              ) : (
                <Entypo
                  onPress={() => {
                    setSelectedOption('card');
                    setTimeout(() => {
                      Alert.alert('UPI / Credit or Debit Card', 'Pay Online', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            console.log('OK Pressed');
                            pay();
                          },
                        },
                      ]);
                    }, 100);
                  }}
                  name="circle"
                  size={24}
                  color="black"
                />
              )}

              <Text>UPI / Credit or Debit Card</Text>
            </View>

            <TouchableOpacity
              onPress={() => setCurrentStep(3)}
              activeOpacity={0.7}
              className="mt-5 items-center justify-center rounded-3xl bg-yellow-400 p-3">
              <Text>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 3 && selectedOption === 'cash' && (
          <View className="mx-5">
            <Text className="text-xl font-bold">Order Now</Text>

            <View className="mt-3 flex-row items-center justify-between gap-2 rounded-md border border-gray-300 bg-white p-2">
              <View>
                <Text className="font-bold">Save 5% and never run out</Text>

                <Text className="mt-1 text-gray-500">Turn on auto deliveries</Text>
              </View>

              <MaterialIcons name="keyboard-arrow-right" size={24} color={'black'} />
            </View>

            <View className="mt-3 rounded-md border border-gray-300 bg-white p-2">
              <Text>Shipping to {selectedAddress.name}</Text>

              <View className="mt-1 flex-row items-center justify-between">
                <Text className="font-medium text-gray-500">Items</Text>

                <Text className="text-gray-500">${total}</Text>
              </View>

              <View className="mt-1 flex-row items-center justify-between">
                <Text className="font-medium text-gray-500">Delivery</Text>

                <Text className="text-gray-500">$0</Text>
              </View>

              <View className="mt-1 flex-row items-center justify-between">
                <Text className="text-xl font-bold">Order Total</Text>

                <Text className="font-bold text-red-500">${total}</Text>
              </View>
            </View>

            <View className="mt-3 rounded-md border border-gray-300 bg-white p-2">
              <Text className="text-gray-500">Pay With</Text>

              <Text className="mt-2 font-semibold">Pay on Delivery (Cash)</Text>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              className="mt-5 items-center justify-center rounded-3xl bg-yellow-400 p-3"
              activeOpacity={0.7}>
              <Text>Place your order</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Confirmation;

const styles = StyleSheet.create({});
