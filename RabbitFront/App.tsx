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
import Search from './src/pages/Search';
import Camera from './src/pages/Camera';
import Data from './src/pages/DataAnalysis';
import Profile from './src/pages/Profile';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';

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
          name="Search"
          component={Search}
          options={{
            title: 'Search',
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
          name="Data"
          component={Data}
          options={{
            title: 'Data',
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
          name="Camera"
          component={Camera}
          options={{
            title: 'Camera',
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
          name="Profile"
          component={Profile}
          options={{
            title: 'Profile',
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
