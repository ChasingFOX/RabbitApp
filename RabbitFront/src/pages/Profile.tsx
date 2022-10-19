import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../App';
import {Dimensions} from 'react-native';

type CameraScreenProps = NativeStackScreenProps<LoggedInParamList, 'Camera'>;

function Camera({navigation}: CameraScreenProps) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const onClick = useCallback(() => {
    navigation.navigate('Navi');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.container}>
        <Text style={styles.profileHead}>| Account</Text>
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/foxProfile.png')}
            style={styles.profileIcon}
          />
          <Text style={styles.accountText}>Hyun2</Text>
          <View style={styles.emailPart}>
            <Image
              source={require('../assets/email.png')}
              style={styles.emailIcon}
            />
            <Text style={styles.emailText}>abc@purdue.edu</Text>
          </View>
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
  container: {
    height: '80%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    width: '90%',
    height: '30%',
    display: 'flex',
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
  profileIcon: {
    width: 60,
    height: 60,
  },
  accountText: {
    width: 90,
    fontSize: 15,
    padding: 5,
    margin: 6,

    backgroundColor: 'rgb(217, 217, 217)',
    textAlign: 'center',
  },
  emailPart: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailIcon: {
    width: 20,
    height: 16,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 15,
    padding: 5,
    textAlign: 'center',
  },
  ButtonText: {
    color: 'white',
  },
  signUpButton: {
    backgroundColor: 'red',
  },
  buttonZone: {
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
    width: 200,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
  },
});

export default Camera;
