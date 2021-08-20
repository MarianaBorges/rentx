import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { CarDetails } from '../screens/CarDetails';
import { Scheduling } from '../screens/Scheduling';
import { SchedulingDetails } from '../screens/SchedulingDetails';
import { SchedulingConfirm } from '../screens/SchedulingConfirm';
import { MyCars } from '../screens/MyCars';

const { Navigator, Screen } = createNativeStackNavigator();

export function StackRoutes(){
    return (
        <Navigator screenOptions={{ headerShown: false }} >
            <Screen
                name="Home"
                component={Home}
            />
            <Screen
                name="CarDetails"
                component={CarDetails}
            />
            <Screen
                name="Scheduling"
                component={Scheduling}
            />
            <Screen
                name="SchedulingDetails"
                component={SchedulingDetails}
            />
            <Screen
                name="SchedulingConfirm"
                component={SchedulingConfirm}
            />
            <Screen
                name="MyCars"
                component={MyCars}
            />
        </Navigator>
    )
}
