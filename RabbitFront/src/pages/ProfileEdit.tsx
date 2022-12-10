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
  Alert,
} from 'react-native';
import {useCallback, useState, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {Dimensions} from 'react-native';
import {ProfilePageParamList} from './ProfilePage';
import axios, {AxiosError, AxiosResponse} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions} from '@react-navigation/native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import SignIn from './SignUp';

type ProfileEditScreenProps = NativeStackScreenProps<
  ProfilePageParamList,
  'ProfileEdit'
>;

function ProfileEdit({navigation}: ProfileEditScreenProps) {
  const navi = useNavigation<NavigationProp<RootStackParamList>>();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [btnActive, setBtnActive] = useState(false);
  const [crime, setCrime] = useState<String>('');
  const [prevNickName, setPrevNickName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [clickedCrime, setClickedCrime] = useState<string>('');

  // const [dd, setDd] = useState([]);

  let crimeIndex: number[] = [];

  const [isTrueNumber, setIsTrueNumber] = useState<Number>(0);

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

  // const setIsCrimeClicked = useCallback(() => {
  //   let newArr = [...isClicked];
  //   if (crime !== '') {
  //     crime.split(',').map((item: String) => {
  //       newArr[Number(item)] = true;
  //     }, []);
  //   }
  //   setIsClicked(newArr);
  // }, [crime, isClicked]);

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
    } finally {
    }
  }, [nickName, crime]);

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    let newArr = [...isClicked];
    if (crime !== '') {
      crime.split(',').map((item: String) => {
        newArr[Number(item)] = true;
        console.log('newArr', newArr);
      }, []);
    }
    setIsClicked(newArr);
    console.log(newArr);
  }, [crime]);

  const onChangeNickName = useCallback(
    text => {
      setNickName(text);
      console.log(text);
    },
    [setNickName],
  );

  useEffect(() => {
    setIsTrueNumber(isClicked.filter(item => item == true).length);
  }, [isClicked]);

  const onChangeCrime = useCallback(
    (idx: Number) => {
      console.log(isTrueNumber);
      console.log('isTri', isTrueNumber);
      console.log('isCl', isClicked);
      setIsClicked(prev =>
        prev.map((element, index) => {
          return index === idx ? !element : element;
        }),
      );

      // isClickedReSet();
      console.log('isClicked', isClicked);
    },

    [isClicked],
  );

  // const isClickedReSet = useCallback(() => {
  //   isClicked.map((item, index) => {
  //     if (item == true) {
  //       a.push(Number(index));
  //     }
  //   });
  //   setDd(a);
  //   console.log('das', dd);
  // }, [isClicked]);

  // useEffect(() => {
  //   const a = [...dd];
  //   isClicked.map((item, index) => {
  //     if (item == true) {
  //       a.push(String(index));
  //       console.log('aa', a.join());
  //     }
  //   });
  //   // setDd(String(a));
  //   console.log('das', dd);
  // }, [isClicked]);

  // const ButtonClick = useCallback(
  //   (idx: Number) => {
  //     setIsClicked(prev =>
  //       prev.map((element, index) => {
  //         return index === idx ? !element : element;
  //       }),
  //     );
  //     isClicekdReSet();
  //   },

  //   [isClicked],
  // );

  const onSubmit = useCallback(async () => {
    const userId = await EncryptedStorage.getItem('id');

    isClicked.map((item, index) => {
      if (item === true) {
        crimeIndex.push(Number(index));
      }
    });

    if (isClicked.filter(item => item == true).length > 6) {
      Alert.alert('You should choose up to six.');
      return;
    }

    try {
      {
        console.log('isClicked----', isClicked);
        const response = await axios.post(`${Config.API_URL}/api/user/update`, {
          id: userId,
          nickname: nickName,
          crime: crimeIndex.join(),
        });

        if (response.data.isCrimeUpdated == true) {
          const respone = axios.put(
            `${Config.DIRECTION_API_URL}/api/profile/calculate`,
            {
              crime: crimeIndex.join(),
              id: 88,
            },
          );
          Alert.alert('It will take about 30 minutes to analyze');
        } else {
          Alert.alert('NickName Edit Complete');
        }
        navigation.goBack();
        console.log(response);
      }

      // navigation.goBack();
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('error');
      }
    } finally {
    }
  }, [nickName, crime, isClicked]);

  // useEffect(() => {
  //   const dd: number[] = [];
  //   isClicked.map((item, index) => {
  //     if (item == true) {
  //       dd.push(index);
  //     }
  //   });
  //   setClickedCrime(String(dd));

  //   console.log('use effecti clickedCrime', clickedCrime);
  // }, [isClicked]);

  return (
    <ScrollView>
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
        <View style={styles.editButton}>
          <Text
            style={styles.editButtonText}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    display: 'flex',
    paddingVertical: 50,
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
  editButton: {
    backgroundColor: '#f4511e',
    width: 150,
    paddingHorizontal: 4,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    shadowOffset: {width: 1, height: 3},
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ProfileEdit;
