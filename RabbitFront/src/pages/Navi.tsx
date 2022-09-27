import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {useCallback, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {HomeScreenProps} from '../../App';

function NaviScreen({navigation}: HomeScreenProps) {
  const [latitude, setLatitude] = useState(String(''));
  const [longitude, setLogitude] = useState(String(''));

  const origin = {latitude: 40.42489539482597, longitude: -86.91051411560053};
  const destination = {
    latitude: 40.473360126380996,
    longitude: -86.94642755184898,
  };

  const geoLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        setLatitude(latitude);
        setLogitude(longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000},
    );
  };

  //   const onClick = useCallback(() => {
  //     navigation.navigate('Details');
  //   }, [navigation]);

  const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const [coordinates, setCoordinates] = useState([]);
  // {
  //   latitude: 40.423999345292046,
  //   longitude: -86.91371893175639,
  // },
  // {
  //   latitude: 40.42119341508705,
  //   longitude: -86.91781885879092,
  // },
  // {
  //   latitude: 40.42119341508705,
  //   longitude: -86.91781885879092,
  // },
  // {
  //   latitude: 40.42732532443506,
  //   longitude: -86.92463136381483,
  // },
  // {
  //   latitude: 40.43249524031551,
  //   longitude: -86.9269298077754,
  // },
  // {
  //   latitude: 40.446337675508566,
  //   longitude: -86.92821177376851,
  // },
  // {
  //   latitude: 40.45851363603605,
  //   longitude: -86.93213657343334,
  // },

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MapView
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        } // remove if not using Google Maps
        region={{
          latitude: 40.42489539482597,
          longitude: -86.91051411560053,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}>
        {coordinates.map((coordinates, index) => (
          <Marker key={`coordinate_${index}`} coordinate={coordinates} />
        ))}
        <MapViewDirections
          origin={origin}
          waypoints={coordinates}
          destination={destination}
          apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
          mode="BICYCLING"
          strokeWidth={3}
          strokeColor="rgb(255,0,0)"
          precision="low"
          timePrecision="none"
        />
      </MapView>
      <Text> latitude: {latitude} </Text>
      <Text> longitude: {longitude} </Text>
      <TouchableOpacity
        onPress={() => geoLocation()}
        style={{backgroundColor: '#89B2E9'}}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Get GeoLocation Button
        </Text>
      </TouchableOpacity>

      {/* <TouchableHighlight onPress={onClick}>
        <Text>Home Screen</Text>
      </TouchableHighlight> */}
    </View>
  );
}

export default NaviScreen;
