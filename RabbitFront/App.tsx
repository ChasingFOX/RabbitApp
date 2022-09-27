import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {useCallback, useState} from 'react';
import Navi from './src/pages/Navi';

export type LoggedInParamList = {
  Navi: undefined;
  Search: undefined;
  Data: undefined;
  Profile: undefined;
  Camera: {currentLocation: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Navi'
>;
export type DetailsScreenProps = NativeStackScreenProps<
  ParamListBase,
  'Details'
>;

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

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Navi"
          component={Navi}
          options={{
            title: 'Rabbit',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}
        />
        <Tab.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            title: 'page',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
