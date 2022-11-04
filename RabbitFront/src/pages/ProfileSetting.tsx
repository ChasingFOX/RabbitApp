import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Dimensions} from 'react-native';

type ProfileSettingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp'
>;

function ProfileSetting({navigation}: ProfileSettingScreenProps) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [btnActive, setBtnActive] = useState(false);

  const gender = ['M', 'W'];
  const btn = [true, false];
  const crimeType = [
    'ARSON',
    'ASSAULT',
    'BATTERY',
    'BURGLARY',
    'DAMAGE',
    'SexCrime',
  ];

  const ButtonClick = () => {
    setBtnActive(prev => {
      return !prev;
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.headerIcon}
        />
        <Text style={styles.profileHead}>| Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          keyboardType="email-address"
          blurOnSubmit={false}
        />
        <Text style={styles.profileHead}>| Birth</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          keyboardType="email-address"
          blurOnSubmit={false}
        />
        <Text style={styles.profileHead}>| Gender</Text>
        <View style={styles.buttonZone}>
          {gender.map((item, index) => {
            return (
              <Pressable>
                <View
                  style={
                    btnActive == btn[index]
                      ? styles.optionButton
                      : StyleSheet.compose(
                          styles.optionButton,
                          styles.optionButtonActive,
                        )
                  }>
                  <Text
                    onPress={ButtonClick}
                    style={
                      btnActive == btn[index]
                        ? styles.loginButtonText
                        : StyleSheet.compose(
                            styles.loginButtonText,
                            styles.loginButtonTextActive,
                          )
                    }>
                    {item}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.profileHead}>| Dangers you want to avoid</Text>
        <View style={styles.profileContainer}>
          {crimeType.map((item, index) => {
            return (
              <View style={styles.crimeButtonContainer}>
                <View
                  style={
                    btnActive == btn[index]
                      ? styles.crimeButton
                      : StyleSheet.compose(
                          styles.crimeButton,
                          styles.crimeButtonActive,
                        )
                  }>
                  <Text
                    onPress={ButtonClick}
                    style={
                      btnActive == btn[index]
                        ? styles.crimeButtonText
                        : StyleSheet.compose(
                            styles.crimeButtonText,
                            styles.crimeButtonTextActive,
                          )
                    }>
                    {item}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <Text style={styles.profileHead}>| Dangers you want to avoid</Text>
        <View style={styles.profileContainer}></View>
        <Text style={styles.profileHead}>| Account</Text>
        <View style={styles.profileContainer}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 200,
    height: 110,
  },
  container: {
    height: '80%',
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    width: '90%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 7},
    shadowOpacity: 0.3,
  },
  profileHead: {
    width: '90%',
    fontSize: 17,
    color: 'grey',
    display: 'flex',
    justifyContent: 'flex-start',
  },

  ButtonText: {
    color: 'white',
  },
  signUpButton: {
    backgroundColor: 'red',
  },
  buttonZone: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  inputZone: {
    width: 340,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
  },
  optionButton: {
    backgroundColor: 'white',
    width: 150,
    paddingHorizontal: 20,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 0.3,
    borderColor: 'grey',
    shadowOffset: {width: 1, height: 3},
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  optionButtonActive: {
    backgroundColor: '#f4511e',
  },
  crimeButtonContainer: {
    display: 'flex',
    width: 55,
    height: 90,
    backgroundColor: 'red',
  },
  crimeButton: {
    backgroundColor: 'white',
    width: 90,
    paddingHorizontal: 4,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    borderRadius: 20,
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
  loginButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButtonTextActive: {
    color: 'white',
  },
  crimeButtonText: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
  crimeButtonTextActive: {
    color: 'white',
  },
});

export default ProfileSetting;
