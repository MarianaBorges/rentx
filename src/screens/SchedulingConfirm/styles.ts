import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.colors.header};
    
    padding-top: 40px;
`;

export const Content = styled.View`
    flex:1;
    justify-content: center;
    align-items: center;

    padding-bottom: 45px;
`;

export const Title = styled.Text`
    font-size: ${RFValue(30)}px;
    color: ${({theme})=> theme.colors.shape};
    font-family: ${({theme})=> theme.fonts.secundary_600};

    margin-top: 40px;
`;

export const Message = styled.Text`
    font-size: ${RFValue(15)}px;
    color: ${({theme})=> theme.colors.shape};
    font-family: ${({theme})=> theme.fonts.secundary_600};
    line-height: 25px;
    text-align: center;

    margin-top: 40px;
`;

export const Footer = styled.View`
    width: 100%;
    align-items: center;
    margin: 80px 0;
`
;