import React, { useState, useEffect } from 'react';
import { 
    StatusBar, 
    KeyboardAvoidingView, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert 
} from 'react-native';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import * as Yup from 'yup';

import {
    Container,
    Title,
    Header,
    SubTitle,
    Form,
    Footer
} from './styles';
import { useAuth } from '../../hooks/auth';

import { database } from '../../database';

type RootStackParamList = {
    SignIn: undefined;
    SignUpFirstStep: undefined;
  };

type SignInScreenNavigationProp = StackNavigationProp<
   RootStackParamList,
   'SignIn'
>;


export function SignIn(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const theme = useTheme();
    const navigation = useNavigation<SignInScreenNavigationProp>();
    const { signIn } = useAuth(); 

    async function handleSignIn() {
        try{
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatóri')
                    .email('Insira um E-mail válido'),
                password: Yup.string()
                    .required('A senha é obrigatoria')
            });
            await schema.validate({email, password});
            signIn({email, password});
        }catch(error){
            if (error instanceof Yup.ValidationError) {
                Alert.alert('Opa', error.message);
            }else{
                Alert.alert(
                    'Error na autenticação',
                    'Ocorreu um erro ao fazer login, verifique as credenciais'
                    )
            }
        }
    }
    function handleSingUp(){
        navigation.navigate('SignUpFirstStep');
    }

    useEffect(()=>{
        async function loadData(){
            const userCollection = database.get('users');
            const users = await userCollection.query().fetch();
            console.log(users);
        }
    },[])

    return (
       <KeyboardAvoidingView 
            behavior='position' 
            enabled 
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="transparent"
                    translucent
                />
                <Header>
                    <Title>
                        Estamos{'\n'}quase lá
                    </Title>
                    <SubTitle>
                        Faça seu login para começar{'\n'}uma experiência incrível.
                    </SubTitle>
                </Header>

                <Form>
                    <Input 
                        iconName='mail'
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"    
                        onChangeText={setEmail}
                        value={email}
                    />

                    <PasswordInput 
                        iconName='lock' 
                        placeholder="Senha"
                        onChangeText={setPassword}
                        value={password}
                    />
                </Form>

                <Footer>
                    <Button
                        title='Login'
                        onPress={handleSignIn}
                        loading={false}
                    />
                    <Button
                        title='Criar conta gratuita'
                        color={theme.colors.background_secondary}
                        light
                        onPress={handleSingUp}
                        loading={false}
                    />
                </Footer>

            </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
 );
}