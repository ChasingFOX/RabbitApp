// The code that constitutes the page stack on the main tab

import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import Search from './Navi';
import Direction from './Direction';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type NaviPageParamList = {
  Search: undefined;
  Direction: undefined;
};

type NaviScreenProps = NativeStackScreenProps<LoggedInParamList, 'Navi'>;

const Stack = createNativeStackNavigator();

// The main function
function NaviPage({navigation}: NaviScreenProps) {
  return (
    // code that constitutes the screen navigator
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Direction"
        component={Direction}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default NaviPage;
