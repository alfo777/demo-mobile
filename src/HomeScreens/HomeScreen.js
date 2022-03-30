import { 
  StyleSheet, 
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import React from 'react'
import imagenCromiun from '../../assets/cromiun.png'
import { Title, Text,Button } from 'react-native-paper'
import { useAuthUser } from '../context/AuthContext';
  
export default HomeScreen = ({navigation}) =>{

      const {signOut} = useAuthUser();

  
      return(
        <View style={styles.container}>
        <SafeAreaView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
                <Image source={imagenCromiun} style={styles.image}></Image>
                <Title style={styles.title}>Bienvenido a My App</Title>

            </View>
            <Button mode='contained' onPress={()=>{signOut()}}>
              <Text>
                SALIR
              </Text>
            </Button>
            </ScrollView>
        </SafeAreaView>
      </View>
      )
    }


    const styles = StyleSheet.create(
      { input: {
          borderWidth: 2, 
          marginBottom: 15,
          marginTop: 15,
          backgroundColor: '#f5fcff',
          height: 50
         },
        container: {
          flex:1,
          backgroundColor: '#f5fcff',
          paddingLeft: 15,
          paddingRight: 15,
          marginTop: 30
         },
         title: {textAlign: 'center',fontSize: 25, marginBottom: 35},
         button: {
           backgroundColor: 'skyblue', 
           paddingTop: 15, 
           paddingBottom:15, 
           width: 100, 
           alignSelf: 'center', 
           marginTop: 30, 
           marginBottom:30,
           borderRadius: 10},
         buttonText: {textAlign: 'center', fontSize: 13},
         forgotPasswordButton: {textAlign: 'center', fontSize: 13, color: 'skyblue'},
         image:{
           height: 170,
           width: 170,
           alignSelf: 'center',
           marginTop: 50,
           marginBottom: 80
         }}
   )