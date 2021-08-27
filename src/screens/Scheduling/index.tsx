import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { 
    Calendar, 
    DayProps, 
    MarkedDateProps,
    generateInterval 
} from '../../components/Calendar';

import ArrowSvg from '../../assets/arrow.svg';

import {
    Container,
    Header,
    Title,
    RentalPeriod, 
    DateInfo, 
    DateTitle, 
    DateValue,
    Footer,
    Content
} from './styles';

import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { CarDTO } from '../../dtos/CarDTO';

type RootStackParamList = {
    Scheduling: undefined;
    SchedulingDetails: undefined;
  };
  
type SchedulingScreenNavigationProp = StackNavigationProp<
   RootStackParamList,
   'Scheduling'
>;

interface RentalPeriod{
    startFormatted: string;
    endFormatted: string;
}

interface Params {
    car: CarDTO;
  }

export function Scheduling(){
    const [ lastSelectedDate, setLastSelectedDate ] = useState<DayProps>({} as DayProps);
    const [ markedDates, setMarkedDates ] = useState<MarkedDateProps>({} as MarkedDateProps);
    const [ rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({}as RentalPeriod);

    const theme = useTheme();
    const navigation = useNavigation<SchedulingScreenNavigationProp>();
    const route = useRoute();
    const { car } = route.params as Params;
  
    
    function handleSchedulingDetails(){
        navigation.navigate('SchedulingDetails',{
            car,
            dates: Object.keys(markedDates)
        });
    }

    function handleGoBack(){
        navigation.goBack();
    }

    function handleChangeDate(date: DayProps){
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
        let end = date;

        if (start.timestamp > end.timestamp){
            start = end;
            end = start;
        }

        console.log('start',start);
        console.log('end', end);

        setLastSelectedDate(end);
        const interval = generateInterval(start, end);
        setMarkedDates(interval);

        const firstDate = Object.keys(interval)[0];
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

        setRentalPeriod({
            startFormatted: format(getPlatformDate(new Date(firstDate)),'dd/MM/yyyy'),
            endFormatted: format(getPlatformDate(new Date(endDate)),'dd/MM/yyyy'),
        })
    }

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
                    Escolha uma {'\n'}
                    data de início e {'\n'}
                    fim do aluguel
                </Title>

                <RentalPeriod>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>
                            {rentalPeriod.startFormatted}
                        </DateValue>
                    </DateInfo>

                    <ArrowSvg/>

                    <DateInfo>
                        <DateTitle>ATE</DateTitle>
                        <DateValue selected={!!rentalPeriod.endFormatted}>
                            {rentalPeriod.endFormatted}
                        </DateValue>
                    </DateInfo>
                </RentalPeriod>
            </Header>
            <Content>
                <Calendar 
                    markedDates={markedDates}
                    onDayPress={handleChangeDate}
                />
            </Content>
            <Footer>
                <Button 
                    title="Confirmar" 
                    onPress={handleSchedulingDetails} 
                    enabled={!!rentalPeriod.startFormatted}
                />
            </Footer>
        </Container>
    );
}