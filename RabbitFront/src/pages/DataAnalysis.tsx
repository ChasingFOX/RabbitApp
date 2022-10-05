import * as React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../App';

type SearchScreenProps = NativeStackScreenProps<LoggedInParamList, 'Data'>;

function Data({navigation}: SearchScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Navi');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={onClick}>
        <Text>Data Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

export default Data;
