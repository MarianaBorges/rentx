import React, {useState, useEffect} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar, StyleSheet } from 'react-native';

import Animated,{
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';

import {
    Container,
    Header,
    CarImages,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Pariod,
    Price,
    About,
    Accessories,
    Footer,
    OfflineInfo
} from './styles';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { Accessory } from '../../components/Accessory';
import { CarDTO } from '../../dtos/CarDTO';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Car as ModelCar } from '../../database/model/Car'
import { useTheme } from 'styled-components/native';
import api from '../../services/api';
import { useNetInfo } from '@react-native-community/netinfo';

type RootStackParamList = {
  CarDetails: undefined;
  Scheduling: undefined;
};

type CarDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CarDetails'
>;

interface Params {
  car: ModelCar;
}

export function CarDetails(){
  const [ carUpdate, setCarUpdate ] = useState({} as CarDTO);
  const navigation = useNavigation<CarDetailsScreenNavigationProp>();
  const route = useRoute();
  const { car } = route.params as Params;

  const netInfo = useNetInfo();
  const theme = useTheme();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyleAnimation = useAnimatedStyle(()=>{
    return {
      height: interpolate(
        scrollY.value,
        [0,200],
        [200, 70],
        Extrapolate.CLAMP
      ),
    }
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(()=>{
    return {
      opacity: interpolate(
        scrollY.value,
        [0,50],
        [1,0]
        )
    }
  })

  function handleScheduling(){
    navigation.navigate('Scheduling', { car });
  }

  function handleGoBack(){
    navigation.goBack();
  }

  useEffect(()=>{
    async function fetchCarUpdate(){
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdate(response.data);
    }
    if(netInfo.isConnected === true){
      fetchCarUpdate();
    }
  },[netInfo.isConnected]);

 return (
  <Container>
     <StatusBar
      barStyle="light-content"
      backgroundColor="transparent"
      translucent
    />
    <Animated.View style={[
      headerStyleAnimation, 
      styles.header, 
      {backgroundColor: theme.colors.background_secondary}
    ]}>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <Animated.View 
        style={
          sliderCarsStyleAnimation }
        >
        <CarImages>
          <ImageSlider
            imagesUrl={
              !!carUpdate.photos ? carUpdate.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
            }
          />
        </CarImages>
      </Animated.View>
     </Animated.View>
     <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight()+160,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Pariod>{car.period}</Pariod>
            <Price>R$ {netInfo.isConnected === true ? car.price : '...' }</Price>
          </Rent>
        </Details>

        { carUpdate.accessories && 
        <Accessories>
          {
            carUpdate.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>
        }

        <About>{car.about}</About>
      </Animated.ScrollView>

      <Footer>
        <Button 
          title="Escolher Período de alugel" 
          onPress={handleScheduling}
          enabled={netInfo.isConnected === true}
        />
        {netInfo.isConnected === false &&
          <OfflineInfo>
            Conecte-se a Internet para ver mais mais detalhes e agendar seu carro.
          </OfflineInfo>
        }
      </Footer>

  </Container>
 );
}
const styles = StyleSheet.create({
  header:{
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  }
})