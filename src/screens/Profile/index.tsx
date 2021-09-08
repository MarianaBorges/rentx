import React,{ useState }  from 'react';

import { 
    KeyboardAvoidingView, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';


import {
    Container,
    Header,
    HeaderTop,
    LogoutButton,
    HeaderTitle,
    PhotoContainer,
    Photo,
    PhotoButton,
    Content,
    Options,
    Option,
    OptionTitle,
    Section
} from './styles';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/auth';
import { useNetInfo } from '@react-native-community/netinfo';

export function Profile(){
    const { user, signOut, updatedUser } = useAuth();
    const theme = useTheme();
    const navigation = useNavigation();
    const netInfo = useNetInfo();

    const [options, setOptions] = useState<'dataEdit'| 'passwordEdit'>('dataEdit');
    const [avatar, setAvatar] = useState(user.avatar);
    const [name, setName] = useState(user.name);
    const [driverLicense, setDriverLicense] = useState(user.driver_license);


    function handleSingOut(){
        navigation.goBack();
    }

    function handleOptionsChange(optionSelected: 'dataEdit'| 'passwordEdit'){
        if (netInfo.isConnected === false && optionSelected === 'passwordEdit'){
            Alert.alert('Para mudar a senha, conect-se a internet')
        }else{
            setOptions(optionSelected);
        }
    }

    async function handleAvatarSelect() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        
        if(result.cancelled){
            return;
        }

        if (result.uri){
            setAvatar(result.uri);
        }
    }

    async function handleProfileUpdate() {
        try {
            const schema = Yup.object().shape({
                driverLicense: Yup.string()
                .required('CNH é obrigatória'),
                name: Yup.string()
                .required('Nome é obrigatório'),
            });

            const data = { name, driverLicense };
            await schema.validate(data);

            await updatedUser({
                id: user.id,
                user_id: user.user_id,
                email: user.email,
                name,
                driver_license: driverLicense,
                avatar,
                token: user.token
            });

            Alert.alert('Perfil atualizado');
        } catch (error) {
            console.error(error);
            if(error instanceof Yup.ValidationError){
                Alert.alert('Opss', error.message);
            }else{
                Alert.alert('Não foi possível atualizar perfil!');
            }
            
        }
    }

    async function handleSignOut(){
        Alert.alert('Tem certeza?',
        'Se você sair vai precisar de internet para se conectar novamente.',
        [
            {
                text: 'Cancelar',
                onPress: () => {}
            },
            {
                text: 'Sair',
                onPress: () => signOut() 
            }
        ]
        )
    }

    return (
        <KeyboardAvoidingView 
            behavior='position' 
            enabled 
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <HeaderTop>
                        <BackButton
                            color={theme.colors.shape}
                            onPress={handleSingOut}
                        />
                        <HeaderTitle>Editar Perfil</HeaderTitle>
                        <LogoutButton onPress={handleSignOut}>
                            <Feather
                                name='power'
                                size={24}
                                color={theme.colors.shape}
                            />
                        </LogoutButton>
                    </HeaderTop>
                    <PhotoContainer>
                        { !!avatar && <Photo source={{uri: avatar}}/> }
                        <PhotoButton onPress={handleAvatarSelect}>
                            <Feather
                                name='camera'
                                size={24}
                                color={theme.colors.shape}
                            />
                        </PhotoButton>
                    </PhotoContainer>
                </Header>

                <Content style={{ marginBottom: useBottomTabBarHeight() }}>
                    <Options>
                        <Option 
                            active={options === 'dataEdit'}
                            onPress={() => handleOptionsChange('dataEdit')}    
                        >
                            <OptionTitle active={options === 'dataEdit'}>
                                Dados
                            </OptionTitle>
                        </Option>
                        <Option 
                            active={options === 'passwordEdit'}
                            onPress={() => handleOptionsChange('passwordEdit')}
                        >
                            <OptionTitle active={options === 'passwordEdit'}>
                                Trocar senha
                            </OptionTitle>
                        </Option>
                    </Options>    
                    {
                        options === 'dataEdit' ?
                        <Section>
                            <Input
                                iconName="user"
                                value="name"
                                autoCorrect={false}
                                defaultValue={user.name}
                                onChangeText={setName}
                            />
                            <Input
                                iconName="mail"
                                value="e-mail"
                                editable={false}
                                defaultValue={user.email}
                            />
                            <Input
                                iconName="credit-card"
                                value="CNH"
                                keyboardType="numeric"
                                defaultValue={user.driver_license}
                                onChangeText={setDriverLicense}
                            />

                        </Section>
                        :
                        <Section>
                            <PasswordInput
                                iconName="lock"
                                value="Senha atual"
                                autoCorrect={false}
                            />
                            <PasswordInput
                                iconName="lock"
                                value="Nova senha"
                                autoCorrect={false}
                            />
                            <PasswordInput
                                iconName="lock"
                                value="Repetir senha"
                                autoCorrect={false}
                            />

                        </Section>
                    }
                    <Button
                        title="Salvar alterções"
                        onPress={handleProfileUpdate}
                    />
                </Content> 
            </Container>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
 );
}