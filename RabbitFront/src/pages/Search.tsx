import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import {useCallback, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../App';
import {useEffect} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

type SearchScreenProps = NativeStackScreenProps<LoggedInParamList, 'Search'>;

function Search({navigation}: SearchScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Navi');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={onClick}>
        <Text>Search Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

export default Search;
