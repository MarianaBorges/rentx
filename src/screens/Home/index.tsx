import React,{ useEffect, useState } from 'react';
import { StatusBar, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { StackNavigationProp } from '@react-navigation/stack';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../database';
import { Car as ModelCars } from '../../database/model/Car';

//const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList,
} from './styles';

import { Car } from '../../components/Car';
import { LoadAnimated } from '../../components/LoadAnimated';
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
    const [cars, setCars] = useState<ModelCars[]>([]);
    const [loading, setLoading] = useState(true);
    const netInfo = useNetInfo();

    /*const positionY = useSharedValue(0);
    const positionX = useSharedValue(0);

    const myCarsButtonStyle = useAnimatedStyle(() => {
        return {
            transform:[
                { translateX: positionX.value},
                { translateY: positionY.value}
            ]
        }
      });*/

    /*const onGestureEvent = useAnimatedGestureHandler({
        onStart(_, ctx: any){
            ctx.positionX = positionX.value;
            ctx.positionY = positionY.value;
        },
        onActive(event, ctx: any){
            positionX.value = ctx.positionX + event.translationX;
            positionY.value = ctx.positionY + event.translationY;
        },
        onEnd(){
            positionX.value = withSpring(0);
            positionY.value = withSpring(0);
        }
    });*/

    //const theme = useTheme();

    function handleCardDetailsCar(car: CarDTO){
        navigation.navigate('CarDetails', { car });
    }

    /*function handleMyCars(){
        navigation.navigate('MyCars');
    }*/

    async function offlineSynchronize(){
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) =>{
                const response = await api
                .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
                console.log(response.data.changes);
                const { changes, latestVersion } = response.data;
                return { changes, timestamp: latestVersion }
            },
            pushChanges: async ({ changes })=>{
                const user = changes.users;
                console.log('pushChanges', changes)
                await api.post('/users/sync',user).catch(console.log);
            }
        })
    }

    useEffect(()=>{
        let isMounted = true;
        async function fetchCars(){
            try{
                const carCollection = database.get<ModelCars>('cars');
                const cars = await carCollection.query().fetch();
                if (isMounted){
                    setCars(cars);
                }
            }catch(error){
                console.error(error);
            }finally{
                if (isMounted){
                    setLoading(false);
                }
            }
        }
        fetchCars();
        return () =>{
            isMounted = false;
        }
    },[]);

    useEffect(()=>{
        if (netInfo.isConnected === true){
            console.log('dentro do useEffect');
            offlineSynchronize();
        }
    },[netInfo.isConnected])

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
                    {
                        !loading &&
                        <TotalCars>
                            Total de {cars.length} carros
                        </TotalCars>
                    }
                </HeaderContent>
            </Header>
            { loading ? <LoadAnimated /> :
            <CarList
                data={cars}
                keyExtractor={item => item.id}
                renderItem={({item})=>  <Car data={item} onPress={()=>handleCardDetailsCar(item)}/>}
            />
            }

            {/*<PanGestureHandler onGestureEvent={onGestureEvent}> 
                <Animated.View
                    style={[
                        myCarsButtonStyle,
                        {
                            position: 'absolute',
                            bottom: 13,
                            right: 22
                        }
                    ]}
                >
                    <ButtonAnimated 
                        onPress={handleMyCars}
                        style={[styles.button, { backgroundColor: theme.colors.main}]}    
                    >
                        <Ionicons
                            name='ios-car-sport'
                            size={32}
                            color={theme.colors.main_light}
                        />
                    </ButtonAnimated>
                </Animated.View>
                </PanGestureHandler>*/}
        </Container>
    );  
}

/*const styles = StyleSheet.create({
    button:{
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
});*/