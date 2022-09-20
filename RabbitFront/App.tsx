import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Text, TouchableHighlight, View, TouchableOpacity} from 'react-native';
import {useCallback, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

// function GeoLocationAPI() {
//   const [latitude, setLatitude] = useState(String(''));
//   const [longitude, setLogitude] = useState(String(''));

//   const geoLocation = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         const latitude = JSON.stringify(position.coords.latitude);
//         const longitude = JSON.stringify(position.coords.longitude);

//         setLatitude(latitude);
//         setLogitude(longitude);
//       },
//       error => {
//         console.log(error.code, error.message);
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   return (
//     <View>
//       <Text> latitude: {latitude} </Text>
//       <Text> longitude: {longitude} </Text>
//       <TouchableOpacity
//         onPress={() => geoLocation()}
//         style={{backgroundColor: '#89B2E9'}}>
//         <Text style={{color: 'white', textAlign: 'center'}}>
//           Get GeoLocation Button
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

function HomeScreen({navigation}: HomeScreenProps) {
  const [latitude, setLatitude] = useState(String(''));
  const [longitude, setLogitude] = useState(String(''));

  const geoLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        setLatitude(latitude);
        setLogitude(longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000},
    );
  };

  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text> latitude: {latitude} </Text>
      <Text> longitude: {longitude} </Text>
      <TouchableOpacity
        onPress={() => geoLocation()}
        style={{backgroundColor: '#89B2E9'}}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Get GeoLocation Button
        </Text>
      </TouchableOpacity>
      <TouchableHighlight onPress={onClick}>
        <Text>Home Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={onClick}>
        <Text>Details Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Overview'}}
        />
        <Stack.Screen name="Details">
          {props => <DetailsScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
