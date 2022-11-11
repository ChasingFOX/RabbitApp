// SignIn Screen Code
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Touchable,
  Pressable,
  Alert,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [passWord, setPassWord] = useState('');
  const [nickName, setNickName] = useState('');
  const [loading, setLoading] = useState(false);

  const crimetype = [
    {id: 1, type: 'Assualt'},
    {id: 2, type: 'Battery'},
    {id: 3, type: 'Homicide'},
    {id: 4, type: 'Human Tracking'},
    {id: 5, type: 'Kidnapping'},
    {id: 6, type: 'Narcotics'},
    {id: 7, type: 'Public Indecency'},
    {id: 8, type: 'Robbery'},
    {id: 9, type: 'Sexual'},
    {id: 10, type: 'Stalking'},
    {id: 11, type: 'Weapon'},
  ];
  const [isClicked, setIsClicked] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const isTrueNumber = isClicked.filter(item => item == true);
  useEffect(() => {
    if (isTrueNumber.length == 7) {
      Alert.alert('You can choose up to six.');
    }
    console.log(isTrueNumber);
  }, [isClicked]);

  const ButtonClick = useCallback(
    (idx: Number) => {
      setIsClicked(prev =>
        prev.map((element, index) => {
          return index === idx ? !element : element;
        }),
      );
    },
    [isClicked],
  );

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    if (!email || !email.trim()) {
      return Alert.alert('Alert', 'Please Check your Email again');
    }
    if (!passWord || !passWord.trim()) {
      return Alert.alert('Alert', 'Please Check your Password again');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(passWord)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }

    console.log(Config.API_URL);

    try {
      {
        setLoading(true);
        const response = await axios.post(`${Config.API_URL}/api/user`, {
          name: email,
          // passWord,
          // isClicked,
        });
        console.log(response);
        Alert.alert('알림', '회원가입에 성공하였습니다.');
        navigation.goBack();
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      setLoading(false);
      console.log(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', 'error');
      }
    } finally {
      setLoading(false);
    }

    Alert.alert('Login succeeded');
  }, [loading, email, passWord, isClicked]);

  const onChangeEmail = useCallback(text => {
    setEmail(text);
  }, []);

  const onChangePassword = useCallback(text => {
    setPassWord(text);
  }, []);

  const onChangeNickName = useCallback(text => {
    setNickName(text);
  }, []);

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const canGoNext = email && passWord && isTrueNumber.length <= 6;

  return (
    <ScrollView>
      <View style={style.container}>
        <View style={style.logoZone}>
          <Image source={require('../assets/logo.png')} style={style.logo} />
        </View>
        <View style={style.textInputZone}>
          <View>
            <Text style={style.profileHead}>| Email</Text>
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
            <Text style={style.profileHead}>| Password</Text>
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
          <View>
            <Text style={style.profileHead}>| NickName</Text>
            <TextInput
              value={nickName}
              style={style.textInput}
              onChangeText={onChangeNickName}
              placeholder="NickName"
              importantForAutofill="yes"
              autoComplete="name"
              textContentType="name"
              returnKeyType="done"
              blurOnSubmit={false}
              clearButtonMode={'while-editing'}></TextInput>
          </View>
          <Text style={style.profileHead}>
            | Dangers you want to avoid (Maximum 6)
          </Text>
          <View style={style.profileContainer}>
            {crimetype.map((item, index) => {
              return (
                <View key={item.id} style={style.crimeButtonContainer}>
                  <View
                    style={
                      isClicked[index]
                        ? StyleSheet.compose(
                            style.crimeButton,
                            style.crimeButtonActive,
                          )
                        : style.crimeButton
                    }>
                    <Text
                      onPress={() => {
                        ButtonClick(index);
                      }}
                      style={
                        isClicked[index]
                          ? StyleSheet.compose(
                              style.crimeButtonText,
                              style.crimeButtonTextActive,
                            )
                          : style.crimeButtonText
                      }>
                      {item.type}
                    </Text>
                  </View>
                </View>
              );
            })}
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
            disabled={!canGoNext || loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={style.loginButtonText}>Sign Up</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
    marginTop: 30,
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
  profileHead: {
    width: '90%',
    fontSize: 17,
    color: 'grey',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  profileContainer: {
    width: '90%',
    height: 250,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    flexWrap: 'wrap',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 7},
    shadowOpacity: 0.3,
  },
  crimeButtonContainer: {
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  crimeButton: {
    backgroundColor: 'white',
    width: 90,
    paddingHorizontal: 4,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 0.3,
    borderColor: 'grey',
    shadowOffset: {width: 1, height: 3},
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  crimeButtonActive: {
    backgroundColor: '#f4511e',
  },
  crimeButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
  },
  crimeButtonTextActive: {
    color: 'white',
  },
});

export default SignIn;
