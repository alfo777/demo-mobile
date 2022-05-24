import React, {useCallback, useEffect, useState} from 'react'
import {useAuthUser} from '../context/AuthContext';
import {postToGateway, songToTrack} from "../others/utils";
import constants from "../others/constants";
import * as Notifications from 'expo-notifications';
import Top3List from '../Components/Top3List';
import {View} from 'react-native';

const HomeScreen = ({navigation}) => {


  const {userState} = useAuthUser();

  useEffect(() => {
    const subcriptionNotificationReceived = Notifications.addNotificationReceivedListener(
      async notification => {
        const {type, params, screenName} = notification.request.content.data;
        const body = {
          idEmissor: params.idEmissor,
          idReceptor: params.idReceptor,
          redirectTo: constants.USERS_HOST + constants.NOTIFICATION_LIST_URL
        }

        await postToGateway(body, 'POST')
          .then(res => {
            if (res.error !== undefined && res.error !== constants.DUPLICATE_NOTIFICATION_ERROR) {
              alert(res.error);
            }
          })
      });

    const subcriptionNotificationClicked = Notifications.addNotificationResponseReceivedListener(notification => {
      const {type, params, screenName} = notification.notification.request.content.data;

      navigation.navigate(screenName, params);
    });

    return () => {
      subcriptionNotificationClicked.remove();
      subcriptionNotificationReceived.remove();
    };
  }, [navigation]);

  return (
    <View style={{backgroundColor: '#f5fcff', flex: 2, flexGrow: 1}}>
            <Top3List
              title='Canciones favoritas'
              endpoint={constants.MEDIA_HOST + constants.FAVORITE_SONGS + "?" + constants.USER_ID_QUERY_PARAM + userState.uid + "&"}
              navigation={navigation}
              open='FavoriteSongListScreen'
              songList={true}
              />
    </View>
  )
}

export {
  HomeScreen
}
