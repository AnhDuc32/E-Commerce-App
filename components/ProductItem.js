import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from 'redux/CartReducer';
import { useNavigation } from '@react-navigation/native';

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="my-5 items-center justify-center"
      onPress={() =>
        navigation.navigate('Info', {
          id: item.id,
          title: item.name,
          price: item.price,
          carouselImages: Array.isArray(item.image) ? item.image : [item.image],
          color: item.color,
          size: item.size,
          oldPrice: item.oldPrice,
          item: item,
        })
      }>
      <Image
        source={{ uri: item.image }}
        className="mx-5 mb-3 h-44 w-44"
        style={{ resizeMode: 'contain' }}
      />

      <Text className="w-44 text-center" numberOfLines={1}>
        {item.title}
      </Text>

      <View>
        <Text className="text-center">${item.price}</Text>
        <Text className="font-semibold text-yellow-500">{item.rating.rate} ratings</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          addItemToCart(item);
        }}
        activeOpacity={0.7}
        className="mt-2 items-center justify-center rounded-3xl bg-yellow-400 px-6 py-2">
        {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
