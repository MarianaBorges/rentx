import React, {useState, useEffect} from 'react';
import { FlatList, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { LoadAnimated } from '../../components/LoadAnimated';
import { CarDTO } from '../../dtos/CarDTO';
import api from '../../services/api';

import {
    Container,
    Header,
    Title,
    SubTitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate,
} from './styles';

type RootStackParamList = {
    Scheduling: undefined;
    SchedulingDetails: undefined;
  };
  
type SchedulingScreenNavigationProp = StackNavigationProp<
   RootStackParamList,
   'Scheduling'
>;

interface CarProps{
    id: string;
    user_id: string;
    car: CarDTO;
    startDate: string;
    endDate: string;
}

export function MyCars(){
    const [cars, setCars] = useState<CarProps[]>([]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const navigation = useNavigation<SchedulingScreenNavigationProp>();

    function handleGoBack(){
        navigation.goBack();
    }

    useEffect(()=>{
        async function fetchCars(){
            try{
                const response = await api.get('/schedules_byuser?user_id=1');
                setCars(response.data);
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false);
            }
        }

        fetchCars();
    },[])

 return (
  <Container>
        <Header>
            <StatusBar
                barStyle='light-content'
                translucent
                backgroundColor='transparent'
            />
            <BackButton color={theme.colors.shape} onPress={()=>handleGoBack()} />
            <Title>
                Seus agendamentos,{'\n'}
                estão aqui.
            </Title>
            <SubTitle>Conforto, segurança e praticidade.</SubTitle>
        </Header>
        {loading ? <LoadAnimated /> :
            <Content>
                <Appointments>
                    <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                    <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                </Appointments>

                <FlatList
                    data={cars}
                    keyExtractor={item => item.id} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=>(
                        <CarWrapper>
                            <Car data={item.car}/>
                            <CarFooter>
                                <CarFooterTitle>Período</CarFooterTitle>
                                <CarFooterPeriod>
                                    <CarFooterDate>{item.startDate}</CarFooterDate>
                                    <AntDesign
                                        name='arrowright'
                                        size={20}
                                        color={theme.colors.title}
                                        style={{ marginHorizontal: 10}}
                                    />
                                    <CarFooterDate>{item.endDate}</CarFooterDate>
                                </CarFooterPeriod>
                            </CarFooter>
                        </CarWrapper>
                    )} 
                />
            </Content>
        }
  </Container>
 );
}
