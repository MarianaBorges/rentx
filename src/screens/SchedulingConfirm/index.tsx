import React from 'react';
import { useNavigation } from '@react-navigation/native';
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
  

export function SchedulingConfirm(){
    const {width} = useWindowDimensions();
    const {navigate} = useNavigation<SchedulingConfirmScreenNavigationProp>();

    function handleHome(){
      navigate('Home');
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
                <Title>Carro Alugado!</Title>

                <Message>
                    Agora você só precisa ir{'\n'}
                    até a concessionária da RENTX{'\n'}
                    pegar o seu automóvel.
                </Message>
            </Content>
            <Footer>
                <ConfirmButton title='Ok' onPress={handleHome}/>
            </Footer>
        </Container>
    );
}