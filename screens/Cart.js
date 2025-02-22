import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { decrementQuantity, incrementQuantity, removeFromCart } from 'redux/CartReducer';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const navigation = useNavigation();

  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    .map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    dispatch(incrementQuantity(item));
  };
  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };
  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mt-5 bg-white" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-4 bg-cus-blue p-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-1 flex-row items-center gap-2 rounded-sm bg-white">
            <Ionicons name="search-outline" size={24} color="black" className="ml-4" />
            <TextInput placeholder="Search Item" />
          </TouchableOpacity>

          <Ionicons name="mic-sharp" size={24} color="black" />
        </View>

        <View className="flex-row items-center p-3">
          <Text className="text-lg font-medium">Subtotal : </Text>

          <Text className="text-xl font-bold">${total}</Text>
        </View>

        <Text className="mx-3">EMI details Available</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Confirm')}
          className="mx-3 mt-3 items-center justify-center rounded-md bg-yellow-400 p-3"
          activeOpacity={0.7}>
          <Text>Proceed to Buy ({cart.length}) items</Text>
        </TouchableOpacity>

        <Text className="mt-5 h-0 border border-gray-500" />

        <View className="mt-3">
          {cart.map((item, index) => (
            <View
              key={index}
              className="my-2 border border-l-0 border-r-0 border-t-0 border-gray-300 bg-white">
              <TouchableOpacity className="mx-3 mb-3 flex-row justify-between" activeOpacity={0.7}>
                <View>
                  <Image
                    source={{ uri: item.image }}
                    className="h-36 w-36"
                    style={{ resizeMode: 'contain' }}
                  />
                </View>

                <View>
                  <Text numberOfLines={3} className="mt-3 w-44">
                    {item.title}
                  </Text>

                  <Text className="mt-1 text-xl font-bold">${item.price}</Text>

                  <Text className="mt-1 font-medium text-green-500">IN STOCK</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                className="mb-3 mt-1 flex-row items-center gap-2">
                <View className="flex-row items-center rounded-lg px-3 py-1">
                  {item.quantity > 1 ? (
                    <TouchableOpacity
                      onPress={() => decreaseQuantity(item)}
                      className="rounded-b-md rounded-t-md bg-gray-200 p-2"
                      activeOpacity={0.7}>
                      <AntDesign name="minus" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => deleteItem(item)}
                      className="rounded-b-md rounded-t-md bg-red-500 p-2"
                      activeOpacity={0.7}>
                      <AntDesign name="delete" size={24} color="white" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity activeOpacity={0.7} className="bg-white px-5 py-2">
                    <Text>{item.quantity}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => increaseQuantity(item)}
                    activeOpacity={0.7}
                    className="rounded-b-md rounded-t-md bg-gray-200 p-2">
                    <AntDesign name="plus" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => deleteItem(item)}
                  activeOpacity={0.7}
                  className="rounded-md border border-red-500 bg-red-500 px-3 py-2">
                  <Text className="font-medium text-white">Delete</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                className="mx-3 mb-3 flex-row items-center gap-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2">
                  <Text className="font-medium">Save For Later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2">
                  <Text className="font-medium">See More Like This</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
