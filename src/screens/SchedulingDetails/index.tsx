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
import { useAuth } from '../../hooks/auth';
import { useNetInfo } from '@react-native-community/netinfo';
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
  const [ carUpdate, setCarUpdate ] = useState({} as CarDTO);
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({} as RentalPeriod);
  
  const netInfo = useNetInfo();
  const theme = useTheme();
  const navigation = useNavigation<SchedulingDetailsScreenNavigationProp>();
  const { user } = useAuth();
  const route = useRoute();
  const { car, dates } = route.params as Params;

  const total =  Number(car.price * dates.length);

  async function handleSchedulingConfirm(){
    setLoading(true);
    
    await api.post('/rentals',{
      user_id: user.user_id,
      car_id: car.id,
      start_date: new Date(dates[0]),
      end_date: new Date(dates[dates.length - 1]),
      total: total
    })
    .then(() =>{
      navigation.navigate('Confirmation',{
        nextScreenRoute:'Home',
        title: 'Carro alugado!',
        message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`
      })
    })
    .catch((error) => {
      console.error(error);
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

useEffect(()=>{
  async function fetchCarUpdate(){
    const response = await api.get(`/cars/${car.id}`);
    setCarUpdate(response.data);
  }
  if(netInfo.isConnected === true){
    fetchCarUpdate();
  }
},[netInfo.isConnected]);

 return (
  <Container>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdate.photos ? carUpdate.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
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
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        { carUpdate.accessories && 
        <Accessories>
          {
            carUpdate.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>
        }

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
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
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
