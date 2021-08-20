import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
    Footer
} from './styles';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { Accessory } from '../../components/Accessory';
import { CarDTO } from '../../dtos/CarDTO';

type RootStackParamList = {
  CarDetails: undefined;
  Scheduling: undefined;
};

type CarDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CarDetails'
>;

interface Params {
  car: CarDTO;
}

export function CarDetails(){
  const navigation = useNavigation<CarDetailsScreenNavigationProp>();
  const route = useRoute();
  const { car } = route.params as Params;

  function handleScheduling(){
    navigation.navigate('Scheduling', { car });
  }

  function handleGoBack(){
    navigation.goBack();
  }

 return (
  <Container>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={car.photos}
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Pariod>{car.rent.period}</Pariod>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>

        <About>{car.about}</About>
      </Content>

      <Footer>
        <Button title="Escolher Período de alugel" onPress={handleScheduling}/>
      </Footer>

  </Container>
 );
}
