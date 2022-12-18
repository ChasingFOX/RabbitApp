// The Profile Edit Tab Code

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useCallback, useState, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfilePageParamList} from './ProfilePage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

type ProfileEditScreenProps = NativeStackScreenProps<
  ProfilePageParamList,
  'ProfileEdit'
>;

// The main function of Profile Edit page
function ProfileEdit({navigation}: ProfileEditScreenProps) {
  // Codes to store status values
  const [crime, setCrime] = useState<String>('');
  const [nickName, setNickName] = useState<string>('');

  let crimeIndex: number[] = [];

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

  // The function that get the user's information from DB and stores it in the state value.
  const getUserInfo = useCallback(async () => {
    const userId = await EncryptedStorage.getItem('id');
    try {
      {
        const response = await axios.get(
          `${Config.API_URL}/api/user/${userId}`,
        );
        setNickName(response.data.nickname);
        setCrime(response.data.crime);
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
      }
    }
  }, [nickName, crime]);

  // Code to get the user's information from DB each time the page is loaded
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    let newArr = [...isClicked];
    if (crime !== '') {
      crime.split(',').map((item: String) => {
        newArr[Number(item)] = true;
      }, []);
    }
    setIsClicked(newArr);
  }, [crime]);

  // The function that recognizes a nickname change and stores it in a state value
  const onChangeNickName = useCallback(
    text => {
      setNickName(text);
    },
    [setNickName],
  );

  // The function that recognizes a crime change and stores it in a state value
  const onChangeCrime = useCallback(
    (idx: Number) => {
      setIsClicked(prev =>
        prev.map((element, index) => {
          return index === idx ? !element : element;
        }),
      );
    },

    [isClicked],
  );

  // The function that works when you click the Submit button
  const onSubmit = useCallback(async () => {
    const userId = await EncryptedStorage.getItem('id');

    // Code that preprocesses data before sending crime data to the server
    isClicked.map((item, index) => {
      if (item === true) {
        crimeIndex.push(Number(index));
      }
    });

    if (isClicked.filter(item => item == true).length > 6) {
      Alert.alert('You should choose up to six.');
      return;
    }
    // Code that uses axios to communicate with the server to post profile change information
    try {
      {
        const response = await axios.post(`${Config.API_URL}/api/user/update`, {
          id: userId,
          nickname: nickName,
          crime: crimeIndex.join(),
        });

        // Code that uses axios to communicate with the server to put crime change information
        if (response.data.isCrimeUpdated == true) {
          const respone = axios.put(
            `${Config.DIRECTION_API_URL}/api/profile/calculate`,
            {
              id: userId,
            },
          );
          Alert.alert('It will take about 30 minutes to analyze');
        } else {
          Alert.alert('NickName Edit Complete');
        }
        navigation.goBack();
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert(errorResponse?.data?.message);
      }
    } finally {
    }
  }, [nickName, crime, isClicked]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.profileHead}>| Nickname</Text>
        <TextInput
          onChangeText={onChangeNickName}
          style={styles.input}
          placeholder={nickName}
          returnKeyType="next"
          blurOnSubmit={false}
        />
        <Text style={styles.profileHead}>
          | Crimes you want to avoid (Up to 6)
        </Text>
        {/* Code to generate a button in the Crime Container */}
        <View style={styles.crimeContainer}>
          {crimetype.map((item, index) => {
            return (
              <View key={item.id}>
                <View
                  style={
                    isClicked[index]
                      ? StyleSheet.compose(
                          styles.crimeButton,
                          styles.crimeButtonActive,
                        )
                      : styles.crimeButton
                  }>
                  <Text
                    onPress={() => {
                      onChangeCrime(index);
                    }}
                    style={
                      isClicked[index]
                        ? StyleSheet.compose(
                            styles.crimeButtonText,
                            styles.crimeButtonTextActive,
                          )
                        : styles.crimeButtonText
                    }>
                    {item.type}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.notNowButton}>
            <Text style={styles.notNowButtonText} onPress={navigation.goBack}>
              Not now
            </Text>
          </View>
          <View style={styles.submitButton}>
            <Text
              style={styles.submitButtonText}
              onPress={() => {
                Alert.alert(
                  'Alert',
                  'If you change the crime type, it takes 30 minutes to analyze. Do you still want to change it?',
                  [
                    {
                      text: 'NO',
                      onPress: () => {
                        navigation.goBack();
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'YES',
                      onPress: () => {
                        onSubmit();
                      },
                      style: 'default',
                    },
                  ],
                  {
                    cancelable: true,
                    onDismiss: () =>
                      Alert.alert(
                        'This alert was dismissed by tapping outside of the alert dialog.',
                      ),
                  },
                );
              }}>
              Submit
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

//  Css apply Code
const styles = StyleSheet.create({
  scrollView: {height: '100%', backgroundColor: 'white'},
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    display: 'flex',
    paddingVertical: 70,
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
  crimeContainer: {
    width: '90%',
    height: 250,
    display: 'flex',
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 15,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 7},
    shadowOpacity: 0.3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
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
    marginBottom: 30,
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
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  crimeButtonTextActive: {
    color: 'white',
  },
  notNowButton: {
    backgroundColor: 'white',
    width: 100,
    paddingHorizontal: 4,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  notNowButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: 'rgba(255, 129, 57, 0.95)',
    width: 100,
    height: 40,
    paddingHorizontal: 4,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ProfileEdit;
