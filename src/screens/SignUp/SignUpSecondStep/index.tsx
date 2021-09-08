import React, { useState } from 'react';
import { BackButton } from '../../../components/BackButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {   
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
} from 'react-native';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle
} from './styles';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';
import { useTheme } from 'styled-components/native';
import api from '../../../services/api';


type RootStackParamList = {
  SignUpFirstStep: undefined;
  SignUpSecondStep: undefined;
};

type SignUpSecondStepScreenNavigationProp = StackNavigationProp<
 RootStackParamList,
 'SignUpSecondStep'
>;

interface Params {
  user:{
    name: string;
    email: string;
    driverLicense: string;
  }
}

export function SignUpSecondStep(){

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation<SignUpSecondStepScreenNavigationProp>();
  const route = useRoute()
  const theme = useTheme();

  const { user } = route.params as Params;

  function handleBack(){
    navigation.goBack();
  }

  async function handleRegiter(){
   if (!password || !confirmPassword){
     return Alert.alert('Informe a senha e a confirmação');
   } 
   if (password !== confirmPassword){
    return Alert.alert('As senhas não são iguais');
    }

    await api.post('/users',{
      name: user.name,
      email: user.email,
      driver_license: user.driverLicense,
      password,
    })
    .then(()=>{
      navigation.navigate('Confirmation', {
        nextScreenRoute:'SignIn',
        title: 'Conta criada!',
        message: `Agora é só fazer login\ne aproveita`
      })
    })
    .catch(()=>{
      Alert.alert('Oops!', 'Não foi possível cadastrar');
    })
    
  }

  return (
    <KeyboardAvoidingView 
            behavior='position' 
            enabled 
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container>
            <Header>
              <BackButton onPress={handleBack}/>
              <Steps>
                <Bullet active={true}/>
                <Bullet active={false}/>
              </Steps>
            </Header>
            <Title>
              Crie sua{'\n'}conta
            </Title>
            <SubTitle>
              Faça seu cadastro{'\n'}
              forma rápido e fácil
            </SubTitle>
            <Form>
              <FormTitle>2. Dados</FormTitle>
              <PasswordInput
                iconName='lock'
                placeholder='senha'
                onChangeText={setPassword}
                value={password}
              />
               <PasswordInput
                iconName='lock'
                placeholder='Confirmar senha'
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
            </Form>
            <Button 
              title='Confirmar'
              color={theme.colors.success}
              onPress={handleRegiter}
              />
          </Container>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
 );
}