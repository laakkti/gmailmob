import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import axios from 'axios';
import base64 from 'react-native-base64';

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

// ")); //

const getConfig = token => {
  let _token = `Bearer ${token}`;
  const config = {
    headers: {Authorization: _token},
  };

  return config;
};

//const userID='laakkti@gmail.com';
const userID = 'gtwmob1@gmail.com';
//const API_KEY='AIzaSyCzaRAJl1ls_7Q32xLsOhXayEoBRykEBeE';
const API_KEY = 'AIzaSyCzaRAJl1ls_7Q32xLsOhXayEoBRykEBeE';

const baseUrl = `https://gmail.googleapis.com/gmail/v1/users/${userID}/`;

// tee enemmän funktioita niin helpommin ja selkeämmin

const getScope = () => {
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
};

const getMessages = async (subject, config) => {
  // GET https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages?q=Subject%3AInfo%20is%3Aunread&key=[YOUR_API_KEY] HTTP/1.1

  //const query="?q=Subject%3AInfo%20is%3Aunread";
  // Subject saadaan parametrina
  const query = `?q=Subject:${subject} is:unread`;
  //console.log(query);

  const response = await axios.get(baseUrl + 'messages' + query, config);
  // console.log(response.statusText);
  // console.log(response.data);
  // undefined});

  let messages = [];
  if (response.statusText !== 'undefined') {
    let res = response.data.messages;
    messages = res.map(message => message.id);
  }
  return messages;
};

// pitäis laittaa filtteri getMessages metodiin
// TURHA, ehto asetettiin jo queryssä
const getMessageSubject = message => {
  const headers = message.payload.headers;
  for (item in headers) {
    // mutta onhan tuolla indexikin eli suora viittaus siihen
    if (headers[item].name === 'Subject') {
      console.log(item + ' == ' + headers[item].value);
    }
  }
};

const getMessageContent = message => {
  return message.snippet;
};


const sendMessage = async (config) => {


let date=Date.now();

let data2send={
  "date":date,
  "battery":"55",
  "temp":"20.1",
  "location":{"latitude":"123.2",
                   "longitude":"213.5",
             } 
  }
  data2send=JSON.stringify(data2send);


  let datax=(
    "From: gtwmob1@gmail.com\r\n" +
    "To: laakkti@gmail.com\r\n" +
    "Subject: Subject Text\r\n\r\n" +
    data2send
  ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const _data = base64.encode(datax);


//xxx = xxx.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
//console.log(xxx);
//const _data = base64.endecode(xxx);

// https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages/send?key=[YOUR_API_KEY] HTTP/1.1

let url = baseUrl + 'messages/send' + '?key=' + API_KEY;

let data={
  "raw": _data
}

const response = await axios.post(url, data,config);
console.log(response);

}

const readMessage = async (msgId, config) => {

  // https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages/1816ccd8188828de?key=[YOUR_API_KEY] HTTP/1.1
  let url = baseUrl + 'messages/' + msgId + '?key=' + API_KEY;
  //console.log(url);
  try {
    const response = await axios.get(url, config);
    //console.log(response.data.payload.parts[0].body.data);

    let data = response.data.payload.parts[0].body.data;
    console.log(data);
    //const Buffer = require("buffer").Buffer;
    //let encodedAuth = new Buffer(data).toString("base64");
    //console.log(encodedAuth);
    //console.log(base64.decode(response.data.payload.parts[0].body.data));

    //let xxx=utf8.decode("xxxx");
    const _data = base64.decode(data);
    let obj = JSON.parse(_data);
    console.log(obj);
    console.log(obj.IP);

    //console.log(base64.decode("eyJUaXRsZSI6Ikhlcm9rdSIsIlRva2VuIjoiYmVhcmVyIGV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeWJtRnRaU0k2SW14aFlXdHJkR2tpTENKcFpDSTZJalZqWTJNME4yWmpPV1U1TURWaE1XTmxPRFE1WVRWak9DSXNJbWxoZENJNk1UVTFPVFU1TWprd09IMC5JbnJDVFFBODd0Z0ZFdU5XUDk1OV95WllJNFg4VWR2T0R4TXNBTnl4LXVFIiwiSVAiOiIxNzIuMTYuOTUuMTgyIiwiVVJMIjoiZGlnaXNhdm9uaWEuaGVyb2t1YXBwLmNvbTxodHRwOi8vZGlnaXNhdm9uaWEuaGVyb2t1YXBwLmNvbS8IiwiUGF0aCI6Ii9hcGkvZGF0YXMiLCJQb3J0Ijo1OTk0NiwiU29ja2V0SWQiOiJVWUVfX21WN3ZrWDl3NThMQUFBQyIsIlNvdXJjZSI6Imh0dHBzOi8vYXBpLmRhcmtza3kubmV0L2ZvcmVjYXN0L2VhOGE3Y2Q2YTc2YWI3MTM2NTAyZGZlOTFmZGU2ZjdiLyVzP3VuaXRzPXNpJmV4Y2x1ZGU9Y3VycmVudGx5LG1pbnV0ZWx5LGRhaWx5LGFsZXJ0cyxmbGFnczxodHRwczovL2FwaS5kYXJrc2t5Lm5ldC9mb3JlY2FzdC9lYThhN2NkNmE3NmFiNzEzNjUwMmRmZTkxZmRlNmY3Yi8lMjVzP3VuaXRzPXNpJmV4Y2x1ZGU9Y3VycmVudGx5LG1pbnV0ZWx5LGRhaWx5LGFsZXJ0cyxmbGFncz4ifQ0KDQo="));

    return response.data;
  } catch (e) {
    console.log('ERROR: ' + e.message);
    return 'ERROR: ' + e.message;
  }
};

const App: () => Node = () => {
  const [userInfo, setUserInfo] = useState('');
  useEffect(() => {
    // hae scope
    GoogleSignin.configure(getScope());
  }, []);


  const handleSendMessage=async()=>{

      let accessToken = await getAccessToken();
      //console.log('token= ' + accessToken);
      let config = getConfig(accessToken);
      let response = await sendMessage(config);
  }


  const getHandleMessages = async () => {
    let accessToken = await getAccessToken();
    //console.log('token= ' + accessToken);
    let config = getConfig(accessToken);

    let messages = await getMessages('Query', config);
    //console.log("messages="+messages.length);
    // viimeisin viesti [0]

    if (messages.length > 0) {
      let message = await readMessage(messages[0], config);

      console.log(
        '#########################################################################',
      );
      //console.log(message);
      /*
      let content=getMessageContent(message);
      console.log("################################")
      
      content=content.replace(/&quot;/g,'"');
      console.log(content);
      */
      //const obj=JSON.parse(content);
      //console.log("obj="+obj);
    }
  };

  const getAccessToken = async () => {
    const res = await GoogleSignin.getTokens();
    return res.accessToken;
  };

  const signIn = async () => {
    try {
      console.log('before sign');
      await GoogleSignin.hasPlayServices();
      //const userInfo = await GoogleSignin.signIn();

      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
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
        <Button title="Messages" onPress={getHandleMessages} />
        <Button title="Send message" onPress={handleSendMessage} />
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
