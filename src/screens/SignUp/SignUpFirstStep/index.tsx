import React, { useState } from 'react';
import { BackButton } from '../../../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {   
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
} from 'react-native';
import * as Yup from 'yup';

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
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

type RootStackParamList = {
  SignIn: undefined;
  SignUpFirstStep: undefined;
};

type SignUpFirststepScreenNavigationProp = StackNavigationProp<
 RootStackParamList,
 'SignUpFirstStep'
>;

export function SignUpFirstStep(){

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const navigation = useNavigation<SignUpFirststepScreenNavigationProp>();

  function handleBack(){
    navigation.goBack();
  }

  async function handleSecondStep(){
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string()
          .required('CNH é obrigatória'),
        email: Yup.string()
          .email('E-mail inválido')
          .required('E-mail é obrigatório'),
        name: Yup.string()
          .required('Nome é obrigatório'),
      })
      const data = { name, email, driverLicense };
      await schema.validate(data);
      navigation.navigate('SignUpSecondStep',{user:data});
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message);
      }
    }
  
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
              <FormTitle>1. Dados</FormTitle>

              <Input 
                iconName="user"
                placeholder="Nome"
                onChangeText={setName}
                value={name}
              />

              <Input 
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
              />

              <Input 
                iconName="credit-card"
                placeholder="CNH"
                keyboardType="numeric"
                onChangeText={setDriverLicense}
                value={driverLicense}
              />

            </Form>
            <Button title='Próximo' onPress={handleSecondStep}/>
          </Container>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
 );
}