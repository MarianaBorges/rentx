import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
    Container,
    Details,
    Brand,
    Name,
    About,
    Rent,
    Period,
    Price,
    Type,
    CarImage,
} from './styles';

import { Car as ModelCars } from '../../database/model/Car';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { useNetInfo } from '@react-native-community/netinfo';

interface Props extends RectButtonProps{
    data: ModelCars;
}

export function Car({data, ...rest}: Props){

    const netInfo = useNetInfo();
    const IconSvg = getAccessoryIcon(data.fuel_type);

 return (
  <Container {...rest}>
      <Details>
          <Brand>{data.brand}</Brand>
          <Name>{data.name}</Name>

          <About>
              <Rent>
                  <Period>{data.period}</Period>
                  <Price>{`R$ ${netInfo.isConnected === true ? data.price : '...'}`}</Price>
              </Rent>
              <Type>
                  <IconSvg/>
              </Type>
          </About>
      </Details>

      <CarImage source={{ uri: data.thumbnail }} resizeMode="contain"/>
  </Container>
 );
}