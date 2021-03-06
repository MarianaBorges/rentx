import React, {useState, useEffect} from 'react';
import { FlatList, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { LoadAnimated } from '../../components/LoadAnimated';
import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar } from '../../database/model/Car';
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
import { format, parseISO } from 'date-fns/esm';

type RootStackParamList = {
    Scheduling: undefined;
    SchedulingDetails: undefined;
  };
  
type SchedulingScreenNavigationProp = StackNavigationProp<
   RootStackParamList,
   'Scheduling'
>;

interface DataProps{
    id: string,
    car: ModelCar,
    start_date: string,
    end_date: string,
}

export function MyCars(){
    const [cars, setCars] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();
    const theme = useTheme();
    const navigation = useNavigation<SchedulingScreenNavigationProp>();

    function handleGoBack(){
        navigation.goBack();
    }

    useEffect(()=>{
        async function fetchCars(){
            try{
                const response = await api.get('/rentals');
                const dataFormatted = response.data.map((data: DataProps)=>{
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date),'dd/MM/yyyy'),
                    }
                })
                setCars(dataFormatted);
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false);
            }
        }

        fetchCars();
    },[isFocused])

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
                est??o aqui.
            </Title>
            <SubTitle>Conforto, seguran??a e praticidade.</SubTitle>
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
                                <CarFooterTitle>Per??odo</CarFooterTitle>
                                <CarFooterPeriod>
                                    <CarFooterDate>{item.start_date}</CarFooterDate>
                                    <AntDesign
                                        name='arrowright'
                                        size={20}
                                        color={theme.colors.title}
                                        style={{ marginHorizontal: 10}}
                                    />
                                    <CarFooterDate>{item.end_date}</CarFooterDate>
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
