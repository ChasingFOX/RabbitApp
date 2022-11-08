// React Native Entry Point Code
import * as React from 'react';
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
  Image,
  ColorPropType,
} from 'react-native';
import {useCallback, useState} from 'react';
import Navi from './src/pages/Navi';
import Search from './src/pages/Search';
import Camera from './src/pages/Camera';
import Data from './src/pages/DataAnalysis';
import Profile from './src/pages/Profile';
import SignUp from './src/pages/SignUp';
import SignIn from './src/pages/SignIn';
import ProfileSetting from './src/pages/ProfileSetting';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';

export type LoggedInParamList = {
  ProfileSetting: undefined;
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

function AppInner() {
  const [signedUp, setSignedUp] = useState(true);

  return signedUp ? (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: 'SIGN IN'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: 'SIGN UP'}}
      />
    </Stack.Navigator>
  ) : (
    <Tab.Navigator>
      <Tab.Screen
        name="Navi"
        component={Navi}
        options={{
          tabBarActiveTintColor: 'red',
          title: 'Rabbit',
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'black'}}
                  source={require('./src/assets/navigation.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'red'}}
                  source={require('./src/assets/navigation.png')}
                />
              );
            }
          },
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
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'black'}}
                  source={require('./src/assets/search.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'red'}}
                  source={require('./src/assets/search.png')}
                />
              );
            }
          },
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
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'black'}}
                  source={require('./src/assets/dataBar.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'red'}}
                  source={require('./src/assets/dataBar.png')}
                />
              );
            }
          },
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
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'black'}}
                  source={require('./src/assets/camera.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'red'}}
                  source={require('./src/assets/camera.png')}
                />
              );
            }
          },
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold',
          },
        }}
        tabBarOptions={{
          activeTintColor: 'tomato', // 탭 활성
          inactiveTintColor: 'gray', // 탭 비활성
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'black'}}
                  source={require('./src/assets/profile.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: 'red'}}
                  source={require('./src/assets/profile.png')}
                />
              );
            }
          },
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
  );
}

export default AppInner;
