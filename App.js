import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import axios from "axios";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

const getConfig = (token) => {
  let _token = `Bearer ${token}`;
  const config = {
    headers: { Authorization: _token },
  };

  return config;
};


//const userID='laakkti@gmail.com';
const userID='gtwmob1@gmail.com';

const baseUrl=`https://gmail.googleapis.com/gmail/v1/users/${userID}/`


// tee enemmän funktioita niin helpommin ja selkeämmin 

const getScope=()=>{
  return {
    scopes: ['https://mail.google.com/'], // [Android] what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '935481118949-ortglfndok7149qcehltjev4mplietd2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: '', // [Android] specifies an account name on the device that should be used
    iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  };

}

const getMessages = async (config) => {
    
  const response = await axios.get(baseUrl + "messages", config);

  let res=response.data.messages;

  let messages=res.map(message =>message.id);
  console.log(messages);

  //console.log(JSON.stringify(response.data));

  return response.data;
};


const App: () => Node = () => {
  const [userInfo, setUserInfo] = useState('');
  useEffect(() => {

    // hae scope
    GoogleSignin.configure(getScope());
  }, []);

  const getHandleMessages = async () => {

    
    let accessToken=await getAccessToken();
    let config=getConfig(accessToken)
        
        
    let messages= await getMessages(config)
  
    console.log(messages);
  
  }

  const getAccessToken=async ()=>{
  const res = await GoogleSignin.getTokens();
   return res.accessToken;   
  }


  const signIn = async () => {
    try {
      console.log('before sign');
      await GoogleSignin.hasPlayServices();
      //const userInfo = await GoogleSignin.signIn();
      
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      /*await GoogleSignin.signIn().then(result => {
        console.log(result);
        //console.log(result.idToken);
      });*/
      //let tokens=GoogleSignin.getTokens('https://mail.google.com/');

      //const currentUser = await GoogleSignin.getTokens().then((res)=>{
        //console.log(res.accessToken );
        
      //});

      //console.log("tokensxxx ==== "+JSON.stringify(tokens));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <SafeAreaView>
      <View>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          //disabled={this.state.isSigninInProgress}
        />
        <Button title="Messages" onPress={getHandleMessages}/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
