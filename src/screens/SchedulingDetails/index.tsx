import React,{ useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';

import {
    Container,
    Header,
    CarImages,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Pariod,
    Price,
    About,
    Accessories,
    Footer,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal
} from './styles';
import { CarDTO } from '../../dtos/CarDTO';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';
import api from '../../services/api';

type RootStackParamList = {
  SchedulingDetails: undefined;
  SchedulingConfirm: undefined;
};

type SchedulingDetailsScreenNavigationProp = StackNavigationProp<
 RootStackParamList,
 'SchedulingDetails'
>;

interface Params {
    car: CarDTO;
    dates: string[];
  }
  interface RentalPeriod{
    start: string;
    end: string;
  }

export function SchedulingDetails(){
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme();
  const navigation = useNavigation<SchedulingDetailsScreenNavigationProp>();

  const route = useRoute();
  const { car, dates } = route.params as Params;

  const total =  Number(car.rent.price * dates.length);

  async function handleSchedulingConfirm(){
    setLoading(true);
    const schedulingByCar = await api.get(`/schedules_bycars/${car.id}`);
    console.log(schedulingByCar.data.unvailable_dates);

    const unvailable_dates = [
      ...schedulingByCar.data.unavailable_dates,
      ...dates,
    ];

    await api.post('schedules_byuser',{
      user_id: 1,
      car,
      startDate: format(getPlatformDate(new Date(dates[0])),'dd/MM/yyyy'),
      endDate: format(getPlatformDate(new Date(dates[dates.length - 1])),'dd/MM/yyyy'),
    });

    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unvailable_dates
    })
    .then(response =>navigation.navigate('SchedulingConfirm'))
    .catch(() => {
      setLoading(false);
      Alert.alert('Não foi possível confirmar o agendamento');
    })
  }

  function handleGoBack(){
    navigation.goBack();
}

useEffect(()=>{
  setRentalPeriod({
    start: format(getPlatformDate(new Date(dates[0])),'dd/MM/yyyy'),
    end: format(getPlatformDate(new Date(dates[dates.length - 1])),'dd/MM/yyyy'),
  })
},[]);

 return (
  <Container>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={car.photos}
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Pariod>Ao dia</Pariod>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
        {
          car.accessories.map(accessory => (
            <Accessory
              key={accessory.type}
              name={accessory.name}
              icon={getAccessoryIcon(accessory.type)}
            />
          ))
        }
        </Accessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name='calendar'
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>
          <Feather
              name='chevron-right'
              size={RFValue(24)}
              color={theme.colors.text}
            />
          <DateInfo>
            <DateTitle>ATE</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel>Total</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {total}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleSchedulingConfirm}
          enabled={!loading}
          loading={loading}
          />
      </Footer>

  </Container>
 );
}
