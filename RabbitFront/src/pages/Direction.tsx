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

export type Object = {
  navigation: object;
  // safest: undefined;
  // shortest: undefined;
};

function Direction({navigation}: Object) {
  // const route2 = useRoute<RouteProp<NaviPageParamList, 'Direction'>>();
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);
  const [currentLatitude, setCurrentLatitude] = useState(Number);
  const [currentLongitude, setCurrentLongitude] = useState(Number);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: latitude, longitude: longitude},
  ]);
  // const route = useRoute<RouteProp<routeParamList>>();
  // const routeInfo = route.params;

  const departurePosition = useSelector(
    (state: RootState) => state.direction.departurePosition,
  );
  const arrivalPosition = useSelector(
    (state: RootState) => state.direction.arrivalPosition,
  );
  const wayPointChecked = useSelector(
    (state: RootState) => state.waypoint.wayPointChecked,
  );
  const blueWaypoint = useSelector(
    (state: RootState) => state.waypoint.blueWaypoint,
  );
  const greenWaypoint = useSelector(
    (state: RootState) => state.waypoint.greenWaypoint,
  );
  const orangeWaypoint = useSelector(
    (state: RootState) => state.waypoint.orangeWaypoint,
  );
  const redWaypoint = useSelector(
    (state: RootState) => state.waypoint.redWaypoint,
  );
  const yellowWaypoint = useSelector(
    (state: RootState) => state.waypoint.yellowWaypoint,
  );

  console.log('direction-blueWaypoint', blueWaypoint);
  console.log('direction-greenWaypoint', greenWaypoint);
  console.log('direction-orangeWaypoint', orangeWaypoint);
  console.log('direction-redWaypoint', redWaypoint);
  console.log('direction-yellowWaypoint', yellowWaypoint);

  // if (routeInfo) {
  //   console.log(route.params.safetest);
  // }
  // route.params;
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

  bottomSheetRef.current?.present();

  console.log('waypointchecked', wayPointChecked);

  return (
    <BottomSheetModalProvider>
      <View style={{height: '100%', flex: 1, justifyContent: 'flex-start'}}>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={['20%', '20%']}
          onChange={handleSheetChanges}
          style={{
            borderRadius: 25,
            shadow: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 7,
          }}>
          <DirectionSheet route={''} />
        </BottomSheetModal>
        {/* Code to get Google Map on the Background*/}
        <MapView
          style={styles.map}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          region={{
            latitude: arrivalPosition.latitude,
            longitude: arrivalPosition.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onRegionChangeComplete={() => {}}
          showsUserLocation={true}>
          {}

          <Marker coordinate={departurePosition} title="Start" />

          <Marker coordinate={arrivalPosition} title="Arrive" />

          {/* {greenWaypoint.map((destinationCoordinates, index) => (
            <Marker
              key={`coordinate_${index}`}
              coordinate={destinationCoordinates}
              pinColor="blue"
              opacity={0.5}
            />
          ))} */}
          {/* {redWaypoint.map((destinationCoordinates, index) => (
            <View>
              <Marker
                key={`coordinate_${index}`}
                coordinate={destinationCoordinates}
                opacity={0.5}
                title={'1111'}
              />
              <Text>{index}</Text>
            </View>
          ))} */}
          {wayPointChecked[0] ? (
            <MapViewDirections
              origin={departurePosition}
              destination={arrivalPosition}
              waypoints={blueWaypoint}
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
          ) : null}
          {wayPointChecked[1] ? (
            <MapViewDirections
              origin={departurePosition}
              destination={arrivalPosition}
              waypoints={greenWaypoint}
              apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
              mode="WALKING"
              strokeWidth={3}
              strokeColor="rgb(0,255,0)"
              precision="low"
              timePrecision="none"
              onReady={result => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
              }}
            />
          ) : null}
          {wayPointChecked[2] ? (
            <MapViewDirections
              origin={departurePosition}
              destination={arrivalPosition}
              waypoints={orangeWaypoint}
              apikey={'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08'}
              mode="WALKING"
              strokeWidth={3}
              strokeColor="rgb(255,127,0)"
              precision="low"
              timePrecision="none"
              onReady={result => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
              }}
            />
          ) : null}
          {wayPointChecked[3] ? (
            <MapViewDirections
              origin={departurePosition}
              destination={arrivalPosition}
              waypoints={redWaypoint}
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
          ) : null}

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

export default Direction;
