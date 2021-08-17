import React,{ useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList
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

    function handleCardDetailsCar(car: CarDTO){
        navigation.navigate('CarDetails', { car });
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
        </Container>
    );
}