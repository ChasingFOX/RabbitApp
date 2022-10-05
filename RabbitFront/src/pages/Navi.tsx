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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {LoggedInParamList} from '../../App';
import {useEffect} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

type NaviScreenProps = NativeStackScreenProps<LoggedInParamList, 'Navi'>;

function Navi({navigation}: NaviScreenProps) {
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);

  Geolocation.getCurrentPosition(
    position => {
      const latitude = JSON.stringify(position.coords.latitude);
      const longitude = JSON.stringify(position.coords.longitude);
      setLatitude(Number(latitude));
      setLogitude(Number(longitude));

      //   setInterval(() => {
      //     setLatitude(Number(latitude));
      //     setLogitude(Number(longitude));
      //   }, 5000);
    },
    error => {
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000},
  );

  const origin = {latitude: latitude, longitude: longitude};
  const destination = {
    latitude: 40.473360126380996,
    longitude: -86.94642755184898,
  };

  //   setInterval(() => {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         const latitude = JSON.stringify(position.coords.latitude);
  //         const longitude = JSON.stringify(position.coords.longitude);
  //         setLatitude(Number(latitude));
  //         setLogitude(Number(longitude));
  //       },
  //       error => {
  //         console.log(error.code, error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000},
  //     );
  //   }, 2000);

  //   useEffect(() => {}, [latitude, longitude]);

  const geoLocation = () => {
    // if (true) {
    //   Geolocation.getCurrentPosition(
    //     position => {
    //       console.log(position);
    //     },
    //     error => {
    //       // See error code charts below.
    //       console.log(error.code, error.message);
    //     },
    //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    //   );
    //   //   Geolocation.watchPosition();
    // }
    Linking.openURL(
      'https://www.google.com/maps/dir/?api=1&origin=40.42489539482597,-86.91051411560053&destination=40.473360126380996,-86.94642755184898&travelmode=walking&waypoints=40.42119341508705,-86.91781885879092%7C40.42732532443506,-86.92463136381483%7C40.43249524031551,-86.9269298077754%7C40.446337675508566,-86.92821177376851%7C40.45851363603605,-86.93213657343334%7C40.46619283912356,-86.9486192066278%7C40.46716415540354,-86.95429476059878%7C40.47024506180284,-86.95576733520348%7C40.47034248927443,-86.9517606080918%7C40.46857485459526,-86.94694887644629%7C40.47062085295775,-86.939740426341',
    );
  };

  const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const [coordinates, setCoordinates] = useState([
    {
      latitude: 40.423999345292046,
      longitude: -86.91371893175639,
    },
    {
      latitude: 40.42119341508705,
      longitude: -86.91781885879092,
    },
    {
      latitude: 40.42119341508705,
      longitude: -86.91781885879092,
    },
    {
      latitude: 40.42732532443506,
      longitude: -86.92463136381483,
    },
    {
      latitude: 40.43249524031551,
      longitude: -86.9269298077754,
    },
    {
      latitude: 40.446337675508566,
      longitude: -86.92821177376851,
    },
    {
      latitude: 40.45851363603605,
      longitude: -86.93213657343334,
    },
  ]);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <MapView
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        } // remove if not using Google Maps
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.003,
        }}
        showsUserLocation={true}>
        {coordinates.map((coordinates, index) => (
          <Marker key={`coordinate_${index}`} coordinate={coordinates} />
        ))}
        {/* <MapViewDirections
          origin={origin}
          waypoints={coordinates}
          destination={destination}
          apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
          mode="DRIVING"
          strokeWidth={3}
          strokeColor="rgb(255,0,0)"
          precision="low"
          timePrecision="none"
        /> */}
      </MapView>
      <GooglePlacesAutocomplete
        GooglePlacesDetailsQuery={{fields: 'geometry'}}
        fetchDetails={true}
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
          console.log('dd', JSON.stringify(details?.geometry?.location));
        }}
        query={{
          key: 'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08',
          language: 'en',
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'grey',
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
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

export default Navi;
