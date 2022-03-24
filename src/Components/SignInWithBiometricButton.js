import { 
    StyleSheet,
    View,
    Text

} from 'react-native';
  
import React, {useState, useEffect} from 'react'
import { Button } from 'react-native-paper'
import constants from "../others/constants"
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
const utils = require("../others/utils");

  
export default SignInWithBiometricButton = () =>{

      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState();

      /*
      -- casos: 
        *) el usuario ingresa por primera vez, si no existe ID 
                ==> se crea y la envia al backend donde se guarda
        *) el usuario vuelve a ingresar, si existe ID 
                ==> la envia al backend en el request.
                    ==>si el backend dice Ok, entonces entrar
                    ==>si el backend dice No Ok, ???
      
      */

      const setBiometricId = async () =>{
        const biometricId = await SecureStore.getItemAsync('secure_biometricId')
        if( ! biometricId){
            const uuid = uuidv4();
            await SecureStore.setItemAsync('secure_biometricId', JSON.stringify(uuid));
        }
      }


      const handleAuthWithBiometric = async () => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const results = await LocalAuthentication.authenticateAsync();

            if (results.success) {
                setResult('SUCCESS');
                setBiometricId();

            } else if (results.error === 'unknown') {
                setResult('DISABLED');
            } else if (
                results.error === 'user_cancel' ||
                results.error === 'system_cancel' ||
                results.error === 'app_cancel'
            ) {
                setResult('CANCELLED');
            }
        } catch (error) {
            setResult(error.message);
        }

        setLoading(false);

        if (result !== 'SUCCESS')
            return;

        const biometricId = await SecureStore.getItemAsync('secure_biometricId');

        const emailAndPassword = utils.getBiometricalMailAndPassword(biometricId);

        fetch(constants.USERS_HOST + constants.SIGN_IN_URL,
            {
                method: 'POST',
                headers: constants.JSON_HEADER,
                body: JSON.stringify({
                  email: emailAndPassword[0],
                  password: utils.getSHAOf(utils.getSHAOf(emailAndPassword[1])),
                  signin: 'biometric',
                  link: "mobile"
              })
        })
        .then(response=>response.json())
        .then(res => 
            {
                console.log(res);
            })
        .catch(err => alert(err));

      }

      return(
        <View>
          <Button
            icon='fingerprint'
            mode="contained"
            color='red'
            onPress={handleAuthWithBiometric}
            >
            
            <Text>Ingresar con biometria</Text>
          </Button>
        </View>
      )
    }
  