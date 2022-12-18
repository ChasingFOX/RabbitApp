// The code that constitutes the page stack on the profile tab

import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import ProfileMain from './Profile';
import ProfileEdit from './ProfileEdit';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type ProfilePageParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
};

type ProfileScreenProps = NativeStackScreenProps<LoggedInParamList, 'Profile'>;

const Stack = createNativeStackNavigator();

// The main function
function ProfilePage({navigation}: ProfileScreenProps) {
  // code that constitutes the screen navigator
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{headerShown: false, headerTitle: 'Profile'}}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{
          headerShown: true,
          headerTitle: 'Edit',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfilePage;
