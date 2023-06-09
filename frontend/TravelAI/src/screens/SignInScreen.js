import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import Button from '../component/atoms/Button';
import {StackActions, useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import colors from '../theme/colors';
import SocialButton from '../component/atoms/SocialButton';
import {authFacebookSign, authGoogleSign, authNaverSign} from '../services/api';
import NaverLogin from '@react-native-seoul/naver-login';
import {login} from '@react-native-seoul/kakao-login';

GoogleSignin.configure({
  webClientId: '567003577983-an1ml4gbv1buqf19as8rcinum3oultqa.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: '567003577983-mk46jh9jh9dvqcfg0tqnqa2t0hk6pvvm.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const consumerKey = 'yslLLko5U73xJ8HfWEPP';
const consumerSecret = '8dZZfr0tOR';
const appName = 'TravelAI';
const serviceUrlScheme = 'com.twoyoung.travelai';

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const sign_result = await authGoogleSign(idToken);
  console.log(sign_result);
  return sign_result;
}

async function onFacebookButtonPress() {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  const sign_result = await authFacebookSign(data.accessToken);
  console.log(sign_result);
  return sign_result;
}

const onNaverButtonPress = async () => {
  const {failureResponse, successResponse} = await NaverLogin.login({
    appName,
    consumerKey,
    consumerSecret,
    serviceUrlScheme,
  });
  if (successResponse) {
    console.log(successResponse);
    const sign_result = await authNaverSign(successResponse.accessToken);
    console.log(sign_result);
    return sign_result;
  }
};

const onKakaoButtonPress = async () => {
  const token = await login();
  console.log(JSON.stringify(token));
};

function SignInScreen(props) {
  const navigation = useNavigation();
  const [user, setUser] = useState();

  useEffect(() => {
    if (user) {
      navigation.dispatch(StackActions.replace('MainScreen', {user: user}));
    }
  }, [user, navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safearea}>
      <ImageBackground
        style={styles.imageBackground}
        source={{
          uri: 'https://i.pinimg.com/564x/7f/6c/95/7f6c9555512ca982521941cba9de20d9.jpg',
        }}>
        <View style={styles.container}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Please log in to securely store your valuable records.</Text>
          </View>
          <View style={styles.socialBox}>
            <SocialButton
              style={{marginBottom: 10}}
              source={{
                uri: 'https://pixlok.com/wp-content/uploads/2021/04/Google-Icon-PNG.jpg',
              }}
              onPress={() => onGoogleButtonPress().then(res => setUser(res))}
              type="Google"
            />
            <SocialButton
              style={{marginBottom: 10}}
              source={{
                uri: 'https://marcas-logos.net/wp-content/uploads/2020/01/Facebook-Novo-Logo.jpg',
              }}
              onPress={() => onFacebookButtonPress().then(res => setUser(res))}
              type="Facebook"
            />
            <SocialButton
              style={{marginBottom: 10}}
              source={{
                uri: 'https://clova-phinf.pstatic.net/MjAxODAzMjlfOTIg/MDAxNTIyMjg3MzM3OTAy.WkiZikYhauL1hnpLWmCUBJvKjr6xnkmzP99rZPFXVwgg.mNH66A47eL0Mf8G34mPlwBFKP0nZBf2ZJn5D4Rvs8Vwg.PNG/image.png',
              }}
              onPress={() => onNaverButtonPress().then(res => setUser(res))}
              type="Naver"
            />
            <SocialButton
              style={{marginBottom: 10}}
              source={{
                uri: 'https://i.pinimg.com/564x/4f/b5/ab/4fb5abad387bab970b9fa4e1fafb7401.jpg',
              }}
              onPress={() => onKakaoButtonPress().then(res => setUser(res))}
              type="Kakao"
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 84,
    paddingBottom: 50,
  },
  titleBox: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialBox: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
});

export default SignInScreen;
