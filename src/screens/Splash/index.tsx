import React, {useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
Container
} from './styles';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolate,
    runOnJS
} from 'react-native-reanimated';

import BrandSvg from '../../assets/brand.svg';
import LogoSvg from '../../assets/logo.svg';

type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
  };
  
  type SplashScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Splash'
  >;

export function Splash(){
    const splashAnimated = useSharedValue(0);
    const navigation = useNavigation<SplashScreenNavigationProp>();

    const brandStyle = useAnimatedStyle(()=>{
        return {
            opacity: interpolate(splashAnimated.value,[0, 50],[1, 0]),
            transform: [
                {
                    translateX: interpolate(splashAnimated.value,
                        [0, 50],
                        [0, -50],
                        Extrapolate.CLAMP
                        ),
                }]
        }
    });

    const logoStyle = useAnimatedStyle(()=>{
        return {
            opacity: interpolate(splashAnimated.value,[0, 50],[0, 1]),
            transform: [
                {
                    translateX: interpolate(splashAnimated.value,
                        [0, 50],
                        [-50,0],
                        Extrapolate.CLAMP
                        ),
                }]
        }
    });

    function startApp(){
        navigation.navigate('Home');
    }

    useEffect(()=>{
        splashAnimated.value = withTiming(
            50, 
            {duration: 1000},
            ()=>{
                'worklet'
                runOnJS(startApp)();
            }
            )
    },[])
    return (
        <Container>
           <Animated.View style={[brandStyle,{position: 'absolute'}]}>
                <BrandSvg width={80} height={50}/>
           </Animated.View>
           <Animated.View style={[logoStyle,{position: 'absolute'}]}>
                <LogoSvg width={180} height={20}/>
           </Animated.View>
        </Container>
    );
}

