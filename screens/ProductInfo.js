import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from 'redux/CartReducer';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductInfo = () => {
  const route = useRoute();
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();
  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const cart = useSelector((state) => state.cart.cart);
  // console.log(cart);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="mt-5 flex-1 bg-white">
        <View className="flex-row items-center gap-4 bg-cus-blue p-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-1 flex-row items-center gap-2 rounded-sm bg-white">
            <Ionicons name="search-outline" size={24} color="black" className="ml-4" />
            <TextInput placeholder="Search Item" />
          </TouchableOpacity>

          <Ionicons name="mic-sharp" size={24} color="black" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(route?.params?.carouselImages ?? []).map((item, index) => (
            <ImageBackground
              source={{ uri: item }}
              key={index}
              style={{ width, height, marginTop: 25 }}
              imageStyle={{ resizeMode: 'contain' }}>
              <View className="flex-row items-center justify-between p-5">
                <View className="h-11 w-11 flex-row items-center justify-center rounded-3xl bg-red-500">
                  <Text className="text-center text-sm text-white">72% off</Text>
                </View>

                <View className="h-11 w-11 items-center justify-center rounded-3xl bg-gray-200">
                  <Ionicons name="share-social" size={24} color="black" />
                </View>
              </View>

              <View className="mb-5 ml-5 mt-auto h-11 w-11 items-center justify-center rounded-3xl bg-gray-200">
                <Ionicons name="heart-outline" size={24} color="black" />
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        <View className="p-3">
          <Text className="font-medium">{route.params.title}</Text>

          <Text className="mt-2 font-bold">${route.params.price}</Text>
        </View>

        <Text className="h-0 border border-gray-500" />

        {route?.params?.color && route?.params?.size && (
          <View>
            <View className="flex-row items-center p-3">
              <Text>Color: </Text>
              <Text className="font-bold">{route.params.color}</Text>
            </View>

            <View className="flex-row items-center p-3">
              <Text>Size: </Text>
              <Text className="font-bold">{route.params.size}</Text>
            </View>

            <Text className="h-0 border border-gray-500" />
          </View>
        )}

        <View className="p-3">
          <Text className="my-2 font-bold">Total: ${route.params.price}</Text>
          <Text className="text-cyan-500">
            FREE delivery Tomorrow by 3 pm. Order within 10h30m.
          </Text>

          <View className="mt-2 flex-row items-center gap-1">
            <Ionicons name="location" size={24} color="black" />

            <Text className="font-semibold">Deliver to Tom - Hanoi</Text>
          </View>
        </View>

        <Text className="mx-3 font-bold text-green-500">IN STOCK</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => addItemToCart(route.params.item)}
          className="m-3 items-center justify-center rounded-3xl bg-yellow-400 py-3">
          {addedToCart ? (
            <View>
              <Text>Added to Cart</Text>
            </View>
          ) : (
            <Text>Add to Cart</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            addItemToCart(route.params.item)
            navigation.navigate('Confirm')
          }}
          activeOpacity={0.7}
          className="mx-3 mb-3 items-center justify-center rounded-3xl bg-orange-400 py-3">
          <Text>Buy Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({});
