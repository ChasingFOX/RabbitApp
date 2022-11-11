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
import {LoggedInParamList} from '../../AppInner';
import {Dimensions} from 'react-native';
import ProfileMain from './Profile';
import ProfileEdit from './ProfileEdit';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type ProfilePageParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
};

type ProfileScreenProps = NativeStackScreenProps<LoggedInParamList, 'Profile'>;

const Stack = createNativeStackNavigator();

function ProfilePage({navigation}: ProfileScreenProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default ProfilePage;
