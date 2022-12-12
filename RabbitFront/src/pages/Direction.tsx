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
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Polygon,
  LatLng,
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
import Config from 'react-native-config';
import polygonData from '../constants/crime_polygon_vector_dict4.json';
import {useAppDispatch} from '../store';
import waypointSlice from '../slices/waypointSlice';

type NaviScreenProps = NativeStackScreenProps<LoggedInParamList, 'Direction'>;

export type Object = {
  navigation: object;
};

function Direction({navigation}: NaviScreenProps) {
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);
  const [currentLatitude, setCurrentLatitude] = useState(Number);
  const [currentLongitude, setCurrentLongitude] = useState(Number);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: latitude, longitude: longitude},
  ]);
  const [polygonCoordinates, setPolygonCoordinates] = useState(
    JSON.parse(String(polygonData)).Assualt,
  );
  const dispatch = useAppDispatch();
  const crimetype = [
    {id: 1, type: 'Assualt'},
    {id: 2, type: 'Battery'},
    {id: 3, type: 'Homicide'},
    {id: 4, type: 'Human Tracking'},
    {id: 5, type: 'Kidnapping'},
    {id: 6, type: 'Narcotics'},
    {id: 7, type: 'Public Indecency'},
    {id: 8, type: 'Robbery'},
    {id: 9, type: 'Sexual'},
    {id: 10, type: 'Stalking'},
    {id: 11, type: 'Weapon'},
  ];
  const [polygonButton, setPolygonButton] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
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
  }, []);

  const departurePosition = useSelector(
    (state: RootState) => state.direction.departurePosition,
  );
  const arrivalPosition = useSelector(
    (state: RootState) => state.direction.arrivalPosition,
  );
  const wayPointChecked = useSelector(
    (state: RootState) => state.waypoint.wayPointChecked,
  );
  const safeWaypoint = useSelector(
    (state: RootState) => state.waypoint.safeWaypoint,
  );
  const safetestWaypoint = useSelector(
    (state: RootState) => state.waypoint.safetestWaypoint,
  );
  const shortWaypoint = useSelector(
    (state: RootState) => state.waypoint.shortWaypoint,
  );
  const shortestWaypoint = useSelector(
    (state: RootState) => state.waypoint.shortestWaypoint,
  );

  console.log('direction-safeWaypoint', safeWaypoint);
  console.log('direction-safetestWaypoint', safetestWaypoint);
  console.log('direction-shortWaypoint', shortWaypoint);
  console.log('direction-shortestWaypoint', shortestWaypoint);
  console.log('waypointchecked', wayPointChecked);

  // if (routeInfo) {
  //   console.log(route.params.safetest);
  // }
  // route.params;
  // Mandatory coordinates to get a safery route
  // const safetestCoordinate = route?.params;

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index == -1) {
      navigation.goBack();
    }
  }, []);
  // Code to get current location

  const [destinationName, setDestinationName] = useState<string>('');

  bottomSheetRef.current?.present();

  const onPolygon = (crimeType: string) => {
    switch (crimeType) {
      case 'Assualt':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Assualt);
        break;
      case 'Battery':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Battery);
        break;
      case 'Homicide':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Homicide);
        break;
      case 'Human Tracking':
        setPolygonCoordinates(JSON.parse(String(polygonData)).HumanTracking);
        break;
      case 'Kidnapping':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Kidnapping);
        break;
      case 'Narcotics':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Narcotics);
        break;
      case 'Public Indecency':
        setPolygonCoordinates(JSON.parse(String(polygonData)).PublicIndecency);
        break;
      case 'Robbery':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Robbery);
        break;
      case 'Sexual':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Sexual);
        break;
      case 'Stalking':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Stalking);
        break;
      case 'Weapon':
        setPolygonCoordinates(JSON.parse(String(polygonData)).Weapon);
        break;
    }
  };

  const polygonButtonClick = useCallback(
    (idx: Number) => {
      setPolygonButton(prev =>
        prev.map((element, index) => {
          return index === idx ? !element : false;
        }),
      );
      console.log('polygonButton', polygonButton);
    },
    [polygonButton],
  );

  return (
    <BottomSheetModalProvider>
      <View style={{height: '100%', flex: 1, justifyContent: 'flex-start'}}>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={['18%', '42%']}
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
            // Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            PROVIDER_GOOGLE
          }
          region={{
            latitude: arrivalPosition.latitude,
            longitude: arrivalPosition.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onRegionChangeComplete={() => {}}
          showsUserLocation={true}>
          {}

          <Marker coordinate={departurePosition} title="Start" />

          <Marker coordinate={arrivalPosition} title="Arrive" />
          {wayPointChecked[0] ? (
            <MapViewDirections
              origin={departurePosition}
              destination={arrivalPosition}
              waypoints={safeWaypoint}
              optimizeWaypoints={true}
              apikey={Config.GOOGLE_API_URL}
              mode="WALKING"
              strokeWidth={3}
              strokeColor="rgba(87, 148, 102, 1)"
              precision="low"
              timePrecision="none"
              onReady={result => {
                console.log('-d--d', safeWaypoint);
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
              }}
            />
          ) : null}
          {wayPointChecked[1] ? (
            <MapViewDirections
              origin={departurePosition}
              destination={arrivalPosition}
              waypoints={safetestWaypoint}
              apikey={Config.GOOGLE_API_URL}
              mode="WALKING"
              strokeWidth={3}
              strokeColor="rgba(239, 188, 5, 1)"
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
              waypoints={shortWaypoint}
              apikey={Config.GOOGLE_API_URL}
              mode="WALKING"
              strokeWidth={3}
              strokeColor="rgba(255, 129, 57, 0.95)"
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
              waypoints={shortestWaypoint}
              apikey={Config.GOOGLE_API_URL}
              mode="WALKING"
              strokeWidth={3}
              strokeColor="rgba(255, 9, 9, 0.95)"
              precision="low"
              timePrecision="none"
              onReady={result => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
              }}
            />
          ) : null}

          {polygonCoordinates.map((item: LatLng[], index: number) => {
            return (
              <Polygon
                key={index}
                coordinates={item}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                fillColor="rgba(256,26,20,.3)"
                strokeWidth={1}
              />
            );
          })}
        </MapView>
        {/* Code to search direction location */}
        <View>
          <ScrollView horizontal={true} style={styles.polygonContainer}>
            {crimetype.map((item, index) => {
              return (
                <View
                  key={index}
                  style={
                    polygonButton[index]
                      ? StyleSheet.compose(
                          styles.crimeButton,
                          styles.crimeButtonActive,
                        )
                      : styles.crimeButton
                  }>
                  <Text
                    style={
                      polygonButton[index]
                        ? StyleSheet.compose(
                            styles.crimeButtonText,
                            styles.crimeButtonTextActive,
                          )
                        : styles.crimeButtonText
                    }
                    onPress={() => {
                      onPolygon(item.type);
                      polygonButtonClick(index);
                    }}>
                    {item.type}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
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
  polygonContainer: {
    paddingBottom: 13,
  },

  searchIcon: {
    marginTop: 3,
    width: 30,
    height: 30,
    marginLeft: 7,
    marginRight: 1,
  },
  crimeButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 120,
    height: 25,
    paddingHorizontal: 4,
    paddingVertical: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: 'grey',
    shadowOffset: {width: 1, height: 3},
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  crimeButtonActive: {
    backgroundColor: '#f4511e',
  },
  crimeButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
  },
  crimeButtonTextActive: {
    color: 'white',
  },
});

export default Direction;
