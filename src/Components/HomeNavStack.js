import { 
    StyleSheet
  } from 'react-native';
import React, {useEffect, useState} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreens/HomeScreen';
import ProfileScreen from '../HomeScreens/ProfileScreen';
import 'react-native-gesture-handler'
import {useAuthUser} from '../context/AuthContext'
import Menu from './Menu';
import ContentScreen from "../HomeScreens/ContentScreen";
import ArtistsListTab from "../Components/ArtistsListTab";
import { getToGateway, postToGateway } from '../others/utils';
import constants from '../others/constants'
import EditProfileScreen from '../HomeScreens/EditProfileScreen';
import ChatScreen from '../HomeScreens/ChatScreen';
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';

const HomeStack = createNativeStackNavigator();

export default HomeNavStack = () =>{

    const {userState, setUserBasicInfo} = useAuthUser();
    const [expoPushToken, setExpoPushToken] = useState('');


    let registerForPushNotifications = async ()=>{
      let token;

      if (Device.isDevice){
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('No se pudo obterner un token para realizar push notifications');
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;

        saveToken(token);
      }
      else {
        alert('Para realizar push notifications se necesita un dispositivo fisico');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      return token;
    }

    let saveToken = (str) =>{

      const token = str.slice(
        str.indexOf('[') + 1,
        str.indexOf(']'),
      );
      
      console.log(token);
      const requestBody = {
        token: token,
        redirectTo: constants.USERS_HOST + constants.PUSH_NOTIFICATION_TOKEN_URL
             + "?" + constants.USER_ID_QUERY_PARAM + userState.uid 
      }


      postToGateway(requestBody, 'PATCH').
        then(res =>{
          if ( res.error !== undefined ){
            alert(res.error)
          }
        })

    }



    useEffect(()=>{

      if ( userState.userType !== null )
        return;

      function getUserBasicInfo(){

          return getToGateway(constants.USERS_HOST + constants.PROFILE_USER_BASIC_INFO_URL
                        + "?"
                        + constants.USER_ID_QUERY_PARAM
                        + userState.uid);
        }
        getUserBasicInfo()
          .then(res => setUserBasicInfo(res.type, res.name, res.surname));
      
      
      registerForPushNotifications()
          .then(token => 
              {
                setExpoPushToken(token);
              })
      
      
      },[])
    
    /*Todas las pantallas de la Home van aca*/
    return(
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Screen name='Menu' component={Menu} />
            <HomeStack.Screen name='HomeScreen' component={HomeScreen} />
            <HomeStack.Screen name='ProfileScreen' component={ProfileScreen} initialParams={{uid: userState.uid}}/>
            <HomeStack.Screen name='ArtistsListTab' component={ArtistsListTab} />
            <HomeStack.Screen name='ContentScreen' component={ContentScreen} />
            <HomeStack.Screen name='EditProfileScreen' component={EditProfileScreen}/>
            <HomeStack.Screen name='ChatScreen' component={ChatScreen}/>
        </HomeStack.Navigator>
    )
}
