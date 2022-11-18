// Navigation Tab Code

import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Polygon,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {LoggedInParamList} from '../../AppInner';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import DirectionSheet from '../components/DirectionSheet';

type NaviScreenProps = NativeStackScreenProps<LoggedInParamList, 'Navi'>;

function Navi({navigation}: NaviScreenProps) {
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);
  const [currentLatitude, setCurrentLatitude] = useState(Number);
  const [currentLongitude, setCurrentLongitude] = useState(Number);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: latitude, longitude: longitude},
  ]);
  // Mandatory coordinates to get a safery route
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  // Code to get current location
  Geolocation.getCurrentPosition(
    position => {
      const latitude = JSON.stringify(position.coords.latitude);
      const longitude = JSON.stringify(position.coords.longitude);
      setLatitude(Number(latitude));
      setLogitude(Number(longitude));
      setCurrentLatitude(Number(latitude));
      setCurrentLongitude(Number(longitude));
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

  const [destinationName, setDestinationName] = useState<string>('');

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

  bottomSheetRef.current?.present();

  return (
    <BottomSheetModalProvider>
      <View style={{height: '100%', flex: 1, justifyContent: 'flex-start'}}>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={['20%', '20%']}
          onChange={handleSheetChanges}>
          <DirectionSheet />
        </BottomSheetModal>
        {/* Code to get Google Map on the Background*/}
        <MapView
          style={styles.map}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
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
          {}
          {destinationCoordinates.map((destinationCoordinates, index) => (
            <Marker
              key={`coordinate_${index}`}
              coordinate={destinationCoordinates}
            />
          ))}
          {/* <MapViewDirections
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
        /> */}

          {/* Code to make polygon area */}
          <Polygon
            coordinates={polygonCoordinates[0]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            fillColor="rgba(256,26,20,.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={polygonCoordinates[1]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            fillColor="rgba(256,26,20,.3)"
            strokeWidth={2}
          />
        </MapView>
        {/* Code to search direction location */}
        <View style={styles.searchBox}>
          <Image
            source={require('../assets/search.png')}
            style={styles.searchIcon}
          />
          <GooglePlacesAutocomplete
            GooglePlacesDetailsQuery={{fields: 'geometry'}}
            fetchDetails={true}
            placeholder="Search"
            onPress={(data, details = null) => {
              const destinationLocation = [
                {
                  latitude: Number(details?.geometry?.location.lat),
                  longitude: Number(details?.geometry?.location.lng),
                },
              ];
              setDestinationCoordinates(destinationLocation);
              setDestinationName(data.description);
              bottomSheetRef.current?.present();
            }}
            query={{
              key: 'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08',
              language: 'en',
            }}
            styles={{
              textInputContainer: {
                shadowColor: 'black',
                shadowOffset: {width: 1},
                shadowOpacity: 0.6,
                marginHorizontal: 10,
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
        </View>
        <View>
          <Text>'안녕하세요'</Text>
        </View>

        {/* <TouchableOpacity
          onPress={() => geoLocation()}
          style={{backgroundColor: '#89B2E9'}}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Get GeoLocation Button
          </Text>
          <Text> latitude: {latitude} </Text>
          <Text> longitude: {longitude} </Text>
        </TouchableOpacity> */}
      </View>
    </BottomSheetModalProvider>
  );
}
// Css apply Code
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBox: {
    paddingTop: 10,
    paddingBottom: 5,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItem: 'center',

    backgroundColor: 'white',
  },

  searchIcon: {
    marginTop: 3,
    width: 30,
    height: 30,
    marginLeft: 7,
    marginRight: 1,
  },
});

export default Navi;
