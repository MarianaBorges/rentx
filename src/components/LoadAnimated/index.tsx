import React from 'react';

import LottieView from 'lottie-react-native';

import CarLoad from '../../assets/carload.json';

import {
Container
} from './styles';

export function LoadAnimated(){
 return (
  <Container>
    <LottieView
        source={CarLoad}
        style={{height:200}}
        resizeMode='contain'
        autoPlay
        loop
    />
  </Container>
 );
}