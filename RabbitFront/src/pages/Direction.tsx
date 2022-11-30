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
import {NaviPageParamList} from '../pages/NaviPage';
import {RouteProp, useRoute} from '@react-navigation/native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

type NaviScreenProps = NativeStackScreenProps<LoggedInParamList, 'Direction'>;

export type routeParamList = {
  params: object;
  safest: undefined;
  shortest: undefined;
};

function Navi({navigation}: NaviScreenProps) {
  // const route2 = useRoute<RouteProp<NaviPageParamList, 'Direction'>>();
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);
  const [currentLatitude, setCurrentLatitude] = useState(Number);
  const [currentLongitude, setCurrentLongitude] = useState(Number);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: latitude, longitude: longitude},
  ]);
  const route = useRoute<RouteProp<routeParamList>>();
  const routeInfo = route.params;

  const currentPosition = useSelector(
    (state: RootState) => state.direction.currentPosition,
  );
  const destinationPosition = useSelector(
    (state: RootState) => state.direction.destination,
  );

  if (routeInfo) {
    console.log(route.params.safetest);
  }
  route.params;
  // Mandatory coordinates to get a safery route
  // const safetestCoordinate = route?.params;

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

  const origin = {latitude: 41.883118, longitude: -87.622917};
  const destination = {
    latitude: 41.894444,
    longitude: -87.623703,
  };

  const [destinationName, setDestinationName] = useState<string>('');

  const [safeDirection, setSafeDirection] = useState([
    {latitude: 41.8831893, longitude: -87.6229557},

    {
      latitude: 41.8842629,
      longitude: -87.6234411,
    },
    {
      latitude: 41.8843538,
      longitude: -87.623393,
    },
    {
      latitude: 41.8843875,
      longitude: -87.614487,
    },
    {
      latitude: 41.8867789,
      longitude: -87.6141318,
    },
    {
      latitude: 41.8942781,
      longitude: -87.6153689,
    },

    {
      latitude: 41.8943341,
      longitude: -87.6176843,
    },
    {
      latitude: 41.8942915,
      longitude: -87.6201785,
    },
    {
      latitude: 41.8942693,
      longitude: -87.6217596,
    },
  ]);

  const [shortDirection, setShortDirection] = useState([
    {latitude: 41.8831893, longitude: -87.6229557},

    {
      latitude: 41.8840012,
      longitude: -87.6234354,
    },
    {
      latitude: 41.8846016,
      longitude: -87.624288,
    },
    {
      latitude: 41.8865832,
      longitude: -87.6243085,
    },
    {
      latitude: 41.8881127,
      longitude: -87.6243382,
    },
    {
      latitude: 41.8898255,
      longitude: -87.623893,
    },
    {
      latitude: 41.8909594,
      longitude: -87.6239373,
    },
    {
      latitude: 41.8919676,
      longitude: -87.6239677,
    },
    {
      latitude: 41.8932627,
      longitude: -87.6239916,
    },
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
          {/* <DirectionSheet /> */}
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
          {safeDirection.map((destinationCoordinates, index) => (
            <View>
              <Marker
                key={`coordinate_${index}`}
                coordinate={destinationCoordinates}
              />
              <Text>{index}</Text>
            </View>
          ))}
          <MapViewDirections
            origin={origin}
            destination={destination}
            waypoints={safeDirection}
            apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
            mode="WALKING"
            strokeWidth={3}
            strokeColor="rgb(255,0,0)"
            precision="low"
            timePrecision="none"
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
            }}
          />
          <MapViewDirections
            origin={origin}
            destination={destination}
            waypoints={shortDirection}
            apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
            mode="WALKING"
            strokeWidth={3}
            strokeColor="rgb(0,0,255)"
            precision="low"
            timePrecision="none"
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
            }}
          />

          {/* Code to make polygon area */}
          {/* <Polygon
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
          /> */}
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
