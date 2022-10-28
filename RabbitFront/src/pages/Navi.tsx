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
  Polygon,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {LoggedInParamList} from '../../App';
import {useEffect} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

type NaviScreenProps = NativeStackScreenProps<LoggedInParamList, 'Navi'>;

function Navi({navigation}: NaviScreenProps) {
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);
  const [currentLatitude, setCurrentLatitude] = useState(Number);
  const [currentLongitude, setCurrentLongitude] = useState(Number);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: latitude, longitude: longitude},
  ]);
  const [directionCoordinates, setDirectionCoordinates] = useState([
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
    {latitude: 40.47381839642305, longitude: -86.94624699630066},
  ]);

  Geolocation.getCurrentPosition(
    position => {
      const latitude = JSON.stringify(position.coords.latitude);
      const longitude = JSON.stringify(position.coords.longitude);
      setLatitude(Number(latitude));
      setLogitude(Number(longitude));
      setCurrentLatitude(Number(latitude));
      setCurrentLongitude(Number(longitude));
      // setCoordinates([
      //   {
      //     latitude: Number(latitude),
      //     longitude: Number(longitude),
      //   },
      // ]);

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
    latitude: 40.47381839642305,
    longitude: -86.94624699630066,
  };

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

  const [polygonCoordinates, setPolygonCoordinates] = useState([
    [
      {
        latitude: 40.4310126,
        longitude: -86.906664,
      },
      {
        latitude: 40.4350317,
        longitude: -86.9067815,
      },
      {
        latitude: 40.4350337,
        longitude: -86.9056211,
      },
      {
        latitude: 40.4335597,
        longitude: -86.9043596,
      },
      {
        latitude: 40.4309274,
        longitude: -86.9027288,
      },
    ],
    [
      {
        latitude: 40.428616,
        longitude: -86.910736,
      },
      {
        latitude: 40.4311986,
        longitude: -86.9106577,
      },
      {
        latitude: 40.4310461,
        longitude: -86.9131438,
      },
      {
        latitude: 40.4299878,
        longitude: -86.9121109,
      },
    ],
  ]);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <MapView
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        // remove if not using Google Maps
        // initialRegion={{
        //   latitude: latitude,
        //   longitude: longitude,
        //   latitudeDelta: 0.0001,
        //   longitudeDelta: 0.003,
        // }}
        region={{
          latitude:
            destinationCoordinates[0]['latitude'] == 0
              ? latitude
              : destinationCoordinates[0]['latitude'],
          longitude:
            destinationCoordinates[0]['longitude'] == 0
              ? longitude
              : destinationCoordinates[0]['longitude'],
          latitudeDelta: 0.0001,
          longitudeDelta: 0.003,
        }}
        onRegionChangeComplete={() => {}}
        showsUserLocation={true}>
        {/* Googlemap Marker 
        {directionCoordinates.map((directionCoordinates, index) => (
          <Marker
            key={`coordinate_${index}`}
            coordinate={directionCoordinates}
          />
        ))} */}
        {destinationCoordinates.map((destinationCoordinates, index) => (
          <Marker
            key={`coordinate_${index}`}
            coordinate={destinationCoordinates}
          />
        ))}
        {/*  Googlemap Direction
        {coordinates.map((coordinates, index) => (
          <Marker key={`coordinate_${index}`} coordinate={coordinates} />
        ))} */}
        {/* <MapViewDirections
          origin={origin}
          waypoints={directionCoordinates}
          destination={destination}
          apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
          mode="DRIVING"
          strokeWidth={3}
          strokeColor="rgb(255,0,0)"
          precision="low"
          timePrecision="none"
        /> */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
          mode="DRIVING"
          strokeWidth={3}
          strokeColor="rgb(255,255,0s)"
          precision="low"
          timePrecision="none"
          onReady={result => {
            console.log(`Distance: ${result.distance} km`);
            console.log(`Duration: ${result.duration} min.`);
          }}
        />

        <Polygon
          coordinates={polygonCoordinates[0]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          fillColor="rgba(256,26,20,.3)"
          // strokeWidth={6}
        />
        <Polygon
          coordinates={polygonCoordinates[1]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          fillColor="rgba(256,26,20,.3)"
          // strokeWidth={6}
        />
      </MapView>
      <GooglePlacesAutocomplete
        GooglePlacesDetailsQuery={{fields: 'geometry'}}
        fetchDetails={true}
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log(destinationCoordinates[0]['latitude']);
          console.log(typeof destinationCoordinates[0]['latitude']);
          // 'details' is provided when fetchDetails = true

          console.log('dgl-lat', details?.geometry?.location.lat);
          console.log('dgl-lng', details?.geometry?.location.lng);
          const destinationLocation = [
            {
              latitude: Number(details?.geometry?.location.lat),
              longitude: Number(details?.geometry?.location.lng),
            },
          ];

          setDestinationCoordinates(destinationLocation);
          // setLatitude(Number(details?.geometry?.location.lat));
          // setLogitude(Number(details?.geometry?.location.lng));

          // console.log('coordinates', typeof coordinates[0]['latitude']);

          console.log('dd', JSON.stringify(details?.geometry?.location));

          console.log('latitude', typeof latitude);
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

      <TouchableOpacity
        onPress={() => geoLocation()}
        style={{backgroundColor: '#89B2E9'}}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Get GeoLocation Button
        </Text>
        <Text> latitude: {latitude} </Text>
        <Text> longitude: {longitude} </Text>
      </TouchableOpacity>

      {/* <TouchableHighlight onPress={onClick}>
        <Text>Home Screen</Text>
      </TouchableHighlight> */}
    </View>
  );
}

export default Navi;
