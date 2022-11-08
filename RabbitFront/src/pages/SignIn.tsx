// SignIn Screen Code
import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Touchable,
  Pressable,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [passWord, setPassWord] = useState('');

  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('Alert', 'Please Check your Email again');
    }
    if (!passWord || !passWord.trim()) {
      return Alert.alert('Alert', 'Please Check your Password again');
    }
    Alert.alert('Login succeeded');
  }, []);

  const onSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onChangeEmail = useCallback(text => {
    setEmail(text);
  }, []);

  const onChangePassword = useCallback(text => {
    setPassWord(text);
  }, []);

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const canGoNext = email && passWord;

  return (
    <View style={style.container}>
      <View style={style.logoZone}>
        <Image source={require('../assets/logo.png')} style={style.logo} />
      </View>
      <View style={style.textInputZone}>
        <View>
          <TextInput
            value={email}
            style={style.textInput}
            onChangeText={onChangeEmail}
            placeholder="Email"
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="next"
            blurOnSubmit={false}
            clearButtonMode={'while-editing'}
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            ref={emailRef}></TextInput>
        </View>
        <View>
          <TextInput
            value={passWord}
            style={style.textInput}
            placeholder="PassWord"
            onChangeText={onChangePassword}
            autoComplete="password"
            textContentType="password"
            secureTextEntry
            clearButtonMode={'while-editing'}
            ref={passwordRef}
            onSubmitEditing={onSubmit}
          />
        </View>
      </View>
      <View style={style.buttonZone}>
        <Pressable
          onPress={onSubmit}
          style={
            !canGoNext
              ? style.loginButton
              : StyleSheet.compose(style.loginButton, style.loginButtonActive)
          }
          disabled={!canGoNext}>
          <Text style={style.loginButtonText}>Sign In</Text>
        </Pressable>

        <Pressable onPress={onSignUp}>
          <Text
            style={StyleSheet.compose(
              style.loginButtonText,
              style.signUpButtonText,
            )}>
            Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoZone: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 100,
  },
  textInputZone: {
    display: 'flex',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 15,
    color: 'black',
    width: 330,
    height: 50,
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    margin: 10,
    paddingHorizontal: 15,
  },
  buttonZone: {
    margin: 10,
    padding: 20,
    alignItems: 'center',
  },
  loginButton: {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  loginButtonActive: {
    backgroundColor: 'rgba(255, 129, 57, 0.95)',
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  signUpButtonText: {
    color: 'rgba(255, 129, 57, 0.95)',
  },
});

export default SignIn;
