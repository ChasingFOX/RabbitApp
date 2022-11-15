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
import {RootStackParamList} from '../../AppInner';
import {Dimensions} from 'react-native';
import {ProfilePageParamList} from './ProfilePage';

type ProfileEditScreenProps = NativeStackScreenProps<
  ProfilePageParamList,
  'ProfileEdit'
>;

function ProfileEdit({navigation}: ProfileEditScreenProps) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [btnActive, setBtnActive] = useState(false);

  const gender = ['M', 'W'];
  const btn = [true, false];

  const onSubmit = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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

  return (
    <ScrollView>
      <View style={styles.container}>
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

        <Text style={styles.profileHead}>
          | Dangers you want to avoid (Up to 6)
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
                      ButtonClick(index);
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
          <Text style={styles.editButtonText} onPress={onSubmit}>
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
