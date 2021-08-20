import React,{ useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList,
    MyCarButton
} from './styles';

import { Car } from '../../components/Car';
import { Load } from '../../components/Load';
import api from '../../services/api';

import { CarDTO } from '../../dtos/CarDTO';

type RootStackParamList = {
    Home: undefined;
    CarDetails: undefined;
  };

type HomeScreenNavigationProp = StackNavigationProp<
   RootStackParamList,
   'Home'
>;

export function Home(){

    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();

    function handleCardDetailsCar(car: CarDTO){
        navigation.navigate('CarDetails', { car });
    }

    function handleMyCars(){
        navigation.navigate('MyCars');
    }
    useEffect(()=>{
        async function fetchCars(){
            try{
                const response = await api.get('/cars');
                setCars(response.data);
                console.log(response.data)
            }catch(error){
                console.error(error);
            }finally{
                setLoading(false);
            }
        }
        fetchCars();
    },[]);

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Header>
                <HeaderContent>
                    <Logo width={RFValue(108)} height={RFValue(12)}/>
                    <TotalCars>
                        Total de 12 carros
                    </TotalCars>
                </HeaderContent>
            </Header>
            { loading ? <Load /> :
            <CarList
                data={cars}
                keyExtractor={item => item.id}
                renderItem={({item})=>  <Car data={item} onPress={()=>handleCardDetailsCar(item)}/>}
            />
            }

            <MyCarButton onPress={handleMyCars}>
              <Ionicons
                name='ios-car-sport'
                size={32}
                color={theme.colors.main_light}
              />
            </MyCarButton>
        </Container>
    );
}
