// React Native Entry Point Code
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Data from './src/pages/DataAnalysis';
import SignUp from './src/pages/SignUp';
import SignIn from './src/pages/SignIn';
import ProfilePage from './src/pages/ProfilePage';
import NaviPage from './src/pages/NaviPage';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';

export type LoggedInParamList = {
  Navi: undefined;
  Direction: undefined;
  Search: undefined;
  Data: undefined;
  Profile: undefined;
  Camera: {currentLocation: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// Code to load the library for page navigation configuration
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  // Code to branch out the page entering by determining whether you are logged in or not
  return !isLoggedIn ? (
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
        component={NaviPage}
        options={{
          tabBarActiveTintColor: '#f4511e',
          title: 'Rabbit',
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: 'rgba(0, 0, 0, 0.2)',
                  }}
                  source={require('./src/assets/navigation.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: '#f4511e'}}
                  source={require('./src/assets/navigation.png')}
                />
              );
            }
          },
          headerStyle: {
            backgroundColor: 'rgba(255, 129, 57, 0.95)',
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
          tabBarActiveTintColor: '#f4511e',
          title: 'Data',
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: 'rgba(0, 0, 0, 0.2)',
                  }}
                  source={require('./src/assets/dataBar.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 24, tintColor: '#f4511e'}}
                  source={require('./src/assets/dataBar.png')}
                />
              );
            }
          },
          headerStyle: {
            backgroundColor: 'rgba(255, 129, 57, 0.95)',
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
        component={ProfilePage}
        options={{
          tabBarActiveTintColor: '#f4511e',
          title: 'Profile',
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Image
                  style={{
                    width: 24,
                    height: 27,
                    tintColor: 'rgba(0, 0, 0, 0.2)',
                  }}
                  source={require('./src/assets/profile.png')}
                />
              );
            } else if (focused === true) {
              return (
                <Image
                  style={{width: 24, height: 27, tintColor: '#f4511e'}}
                  source={require('./src/assets/profile.png')}
                />
              );
            }
          },
          headerStyle: {
            backgroundColor: 'rgba(255, 129, 57, 0.95)',
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
