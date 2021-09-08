import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar,useWindowDimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
Container,
Content,
Title,
Message,
Footer
} from './styles';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';
import { ConfirmButton } from '../../components/ConfirmButton';

type RootStackParamList = {
    SchedulingConfirm: undefined;
    Home: undefined;
  };
  
  type SchedulingConfirmScreenNavigationProp = StackNavigationProp<
   RootStackParamList,
   'SchedulingDetails'
  >;
  
interface Params{
    title: string;
    message: string;
    nextScreenRoute: string;
}

export function Confirmation(){
    const {width} = useWindowDimensions();
    const {navigate} = useNavigation<SchedulingConfirmScreenNavigationProp>();
    const route = useRoute();
    const { title, message, nextScreenRoute } = route.params as Params;

    function handleHome(){
      navigate(nextScreenRoute);
    }
  
    return (
        <Container>
            <StatusBar
                barStyle='light-content'
                translucent
                backgroundColor='transparent'
            />
            <LogoSvg width={width}/>
            <Content>
                <DoneSvg width={80} height={80}/>
                <Title>{title}</Title>

                <Message>
                   {message}
                </Message>
            </Content>
            <Footer>
                <ConfirmButton title='Ok' onPress={handleHome}/>
            </Footer>
        </Container>
    );
}