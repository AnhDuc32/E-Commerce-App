import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Touchable,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SliderBox } from 'react-native-image-slider-box';
import axios from 'axios';
import ProductItem from 'components/ProductItem';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { BottomModal, SlideAnimation, ModalContent } from 'react-native-modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { UserType } from 'UserContext';
import { API_URL } from '@env';

const Home = () => {
  const list = [
    {
      id: '21',
      image: 'https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg',
      name: 'Home',
    },
    {
      id: '22',
      image: 'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg',
      name: 'Deals',
    },
    {
      id: '23',
      image: 'https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg',
      name: 'Electronics',
    },
    {
      id: '24',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg',
      name: 'Mobiles',
    },
    {
      id: '25',
      image: 'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg',
      name: 'Music',
    },
    {
      id: '26',
      image: 'https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg',
      name: 'Fashion',
    },
  ];
  const images = [
    'https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg',
  ];
  const deals = [
    {
      id: '27',
      title: 'OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)',
      oldPrice: 25000,
      price: 19000,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg',
        'https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg',
      ],
      color: 'Stellar Green',
      size: '6 GB RAM 128GB Storage',
    },
    {
      id: '28',
      title:
        'Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers',
      oldPrice: 74000,
      price: 26000,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg',
        'https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg',
      ],
      color: 'Cloud Navy',
      size: '8 GB RAM 128GB Storage',
    },
    {
      id: '29',
      title:
        'Samsung Galaxy M14 5G (ICY Silver, 4GB, 128GB Storage) | 50MP Triple Cam | 6000 mAh Battery | 5nm Octa-Core Processor | Android 13 | Without Charger',
      oldPrice: 16000,
      price: 14000,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/CatPage/Tiles/June/xcm_banners_m14_5g_rv1_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg',
        'https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg',
      ],
      color: 'Icy Silver',
      size: '6 GB RAM 64GB Storage',
    },
    {
      id: '30',
      title:
        'realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera',
      oldPrice: 12999,
      price: 10999,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/tiyesum/N55/June/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg',
        'https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg',
      ],
    },
  ];
  const offers = [
    {
      id: '31',
      title:
        'Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)',
      offer: '72% off',
      oldPrice: 7500,
      price: 4500,
      image: 'https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg',
      ],
      color: 'Green',
      size: 'Normal',
    },
    {
      id: '32',
      title:
        'Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery',
      offer: '60% off',
      oldPrice: 7955,
      price: 3495,
      image: 'https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg',
      ],
      color: 'black',
      size: 'Normal',
    },
    {
      id: '33',
      title: 'Aishwariya System On Ear Wireless On Ear Bluetooth Headphones',
      offer: '40% off',
      oldPrice: 7955,
      price: 3495,
      image: 'https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg',
      carouselImages: ['https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg'],
      color: 'black',
      size: 'Normal',
    },
    {
      id: '34',
      title:
        'Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery',
      offer: '50% off',
      oldPrice: 24999,
      price: 19999,
      image: 'https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg',
        'https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg',
      ],
      color: 'Norway Blue',
      size: '8GB RAM, 128GB Storage',
    },
  ];

  const { userId, setUserId } = useContext(UserType);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("men's clothing");
  const [items, setItems] = useState([
    { label: "Men's Clothing", value: "men's clothing" },
    { label: 'Jewelery', value: 'jewelery' },
    { label: 'Electronics', value: 'electronics' },
    { label: "Women's Clothing", value: "women's clothing" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.log('Error message: ', error);
      }
    };

    fetchData();
  }, []);

  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://${API_URL}:8000/addresses/${userId}`);
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  return (
    <>
      <SafeAreaView className="flex-1 bg-white pt-5">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center gap-4 bg-cus-blue p-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-1 flex-row items-center gap-2 rounded-sm bg-white">
              <Ionicons name="search-outline" size={24} color="black" className="ml-4" />
              <TextInput placeholder="Search Item" />
            </TouchableOpacity>

            <Ionicons name="mic-sharp" size={24} color="black" />
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            activeOpacity={0.7}
            className="flex-row items-center gap-1 bg-cus-light-blue p-2">
            <Ionicons name="location-outline" size={24} color="black" />

            <TouchableOpacity activeOpacity={0.7}>
              {selectedAddress ? (
                <Text className="text-base font-medium">
                  Deliver to {selectedAddress.name} - {selectedAddress.street}
                </Text>
              ) : (
                <Text className="text-base font-medium">Add a Address</Text>
              )}
            </TouchableOpacity>

            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="m-4 items-center justify-center gap-1"
                activeOpacity={0.7}>
                <Image
                  className="h-10 w-10"
                  style={{
                    resizeMode: 'contain',
                  }}
                  source={{ uri: item.image }}
                />

                <Text className="text-center">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <SliderBox
            images={images}
            autolay
            circleLoop
            dotColor={'#13274f'}
            inactiveDotColor="#90a4ae"
            ImageComponentStyle={{ width: '100%' }}
          />

          <Text className="p-2 text-xl font-bold">Trending Deals of the week</Text>

          <View className="flex-row flex-wrap items-center justify-center">
            {deals.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Info', {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    carouselImages: item.carouselImages,
                    color: item.color,
                    size: item.size,
                    oldPrice: item.oldPrice,
                    item: item,
                  })
                }
                activeOpacity={0.7}
                className="mt-5"
                key={index}>
                <Image
                  className="h-56 w-56"
                  source={{ uri: item.image }}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mt-5 h-0 border border-gray-500" />

          <Text className="p-2 text-xl font-bold">Today's Deals</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Info', {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    carouselImages: item.carouselImages,
                    color: item.color,
                    size: item.size,
                    oldPrice: item.oldPrice,
                    item: item,
                  })
                }
                key={index}
                activeOpacity={0.7}
                className="my-5 items-center justify-center">
                <Image
                  source={{ uri: item.image }}
                  className="h-44 w-44"
                  style={{ resizeMode: 'contain' }}
                />

                <View className="mt-2 w-32 flex-1 rounded-lg bg-red-500 py-2">
                  <Text className="text-center font-semibold text-white">{item.offer}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="mt-2 h-0 border border-gray-500" />

          <View className={`mx-4 w-[45%] ${open ? 'mb-14' : 'mb-4'} mt-5`}>
            <DropDownPicker
              className={`h-8 ${open ? 'mb-28' : 'mb-4'} border-blue-500`}
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="Choose Category"
              onOpen={onGenderOpen}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View className="flex-row flex-wrap items-center justify-center">
            {products
              .filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}>
        <ModalContent style={{ width: '100%', height: 400 }}>
          <View className="mb-2">
            <Text className="text-lg font-medium">Choose your Location</Text>

            <Text className="mt-1 text-lg text-gray-500">
              Select a delivery location to see product availability and delivery options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {addresses.map((item, index) => (
              <TouchableOpacity
                onPress={() => setSelectedAddress(item)}
                className={`mr-3 mt-3 h-36 w-36 items-center justify-center border border-gray-300 p-3 ${selectedAddress === item ? 'bg-orange-200' : 'bg-white'}`}
                activeOpacity={0.7}
                key={index}>
                <View className="mb-1 flex-row items-center gap-1">
                  <Text className="text-base font-bold">{item.name}</Text>

                  <Ionicons name="location-sharp" size={24} color="red" />
                </View>

                <Text className="w-32 text-center text-sm">
                  {item.houseNo}, {item.landmark}
                </Text>

                <Text className="w-32 text-center text-sm">{item.street}</Text>

                <Text className="w-32 text-center text-sm">Hanoi, Vietnam</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Address');
              }}
              className="mt-3 h-36 w-36 items-center justify-center border border-gray-300 p-3"
              activeOpacity={0.7}>
              <Text className="text-center font-medium text-sky-700">
                Add an Address or pick-up point
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View className="mb-6 flex-col gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="location-sharp" size={22} color="skyblue" />
              <Text className="font-normal text-sky-700">Enter an Vietnam pincode</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Ionicons name="locate-sharp" size={22} color="skyblue" />
              <Text className="font-normal text-sky-700">Use my Current Location</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Ionicons name="earth" size={22} color="skyblue" />
              <Text className="font-normal text-sky-700">Deliver outside Vietnam</Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default Home;
