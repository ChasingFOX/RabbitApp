import * as React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../App';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';

type SearchScreenProps = NativeStackScreenProps<LoggedInParamList, 'Data'>;

function Data({navigation}: SearchScreenProps) {
  const getServer = async () => {
    try {
      const response = await axios.get(`${Config.API_URl}`);
      console.log(Config.API_URL);
    } catch (error) {
      console.log('error');
    }
  };

  const onClick = useCallback(() => {
    getServer();
    console.log(Config.API_URL);
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
