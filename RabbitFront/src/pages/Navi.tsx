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
  LatLng,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {NaviPageParamList} from './NaviPage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import SearchSheet from '../components/SearchSheet';
import {useAppDispatch} from '../store';
import directionSlice from '../slices/directionSlice';

import polygonData from '../constants/crime_polygon_vector_dict4.json';
import test from '../constants/test.json';
import {ScrollView} from 'react-native-gesture-handler';

type SearchScreenProps = NativeStackScreenProps<NaviPageParamList, 'Search'>;

function Search({navigation}: SearchScreenProps) {
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

  const [assualt, setAssault] = useState(false);
  const [battery, setBattery] = useState(false);
  const [homicide, setHomicide] = useState(false);
  const [humanTracking, setHumanTracking] = useState(false);
  const [kidnapping, setKidnapping] = useState(false);
  const [narcotics, setNarcotics] = useState(false);
  const [publicIndecency, setPublicIndecency] = useState(false);
  const [robbery, setRobbery] = useState(false);
  const [sexual, setSexual] = useState(false);
  const [stalking, setStalking] = useState(false);
  const [weapon, setWeapon] = useState(false);

  const [polygonCoordinates, setPolygonCoordinates] = useState(
    JSON.parse(String(polygonData)).Assualt,
  );

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

  const dispatch = useAppDispatch();
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

  // Link to obtain current coordinates will be modified later
  const geoLocation = () => {
    if (true) {
      Geolocation.getCurrentPosition(
        position => {
          return position;
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
    Linking.openURL(
      'https://www.google.com/maps/dir/?api=1&origin=40.42489539482597,-86.91051411560053&destination=40.473360126380996,-86.94642755184898&travelmode=walking&waypoints=40.42119341508705,-86.91781885879092%7C40.42732532443506,-86.92463136381483%7C40.43249524031551,-86.9269298077754%7C40.446337675508566,-86.92821177376851%7C40.45851363603605,-86.93213657343334%7C40.46619283912356,-86.9486192066278%7C40.46716415540354,-86.95429476059878%7C40.47024506180284,-86.95576733520348%7C40.47034248927443,-86.9517606080918%7C40.46857485459526,-86.94694887644629%7C40.47062085295775,-86.939740426341',
    );
  };

  const [destinationName, setDestinationName] = useState<string>('');

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
          snapPoints={['25%', '50%']}
          onChange={handleSheetChanges}>
          <SearchSheet
            destination={destinationName}
            destinationCoordinate={destinationCoordinates}
          />
        </BottomSheetModal>
        {/* Code to get Google Map on the Background*/}
        <MapView
          style={styles.map}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          region={{
            latitude: 41.86659392082987,
            longitude: -87.67360410595464,
            latitudeDelta: 0.7,
            longitudeDelta: 0.7,
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
          {/* <Polygon
                coordinates={[]}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                fillColor="rgba(256,26,20,.3)"
                strokeWidth={1}
              /> */}
          {polygonCoordinates.map((item: LatLng[]) => {
            return (
              <Polygon
                coordinates={item}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                fillColor="rgba(256,26,20,.3)"
                strokeWidth={1}
              />
            );
          })}
        </MapView>
        {/* Code to search direction location */}
        <View style={styles.test}>
          <View style={styles.searchBox}>
            <Image
              source={require('../assets/search.png')}
              style={styles.searchIcon}
            />
            <GooglePlacesAutocomplete
              GooglePlacesDetailsQuery={{fields: 'geometry'}}
              fetchDetails={true}
              enablePoweredByContainer={false}
              query={{
                key: 'AIzaSyB_nbHi0KEhdlrM8ioBv_GpYCeVH2p1-08',
                language: 'en',
              }}
              placeholder="Current Position"
              onPress={(data, details = null) => {
                const destinationLocation = [
                  {
                    latitude: Number(details?.geometry?.location.lat),
                    longitude: Number(details?.geometry?.location.lng),
                  },
                ];
                setDestinationCoordinates(destinationLocation);
                setDestinationName(data.description);
                // Use current location and destination data for each page and store it in the reader's repository
                dispatch(
                  directionSlice.actions.setDeparturePosition({
                    departurePosition: {
                      latitude: details?.geometry?.location.lat,
                      longitude: details?.geometry?.location.lng,
                    },
                  }),
                );
                console.log('----', details?.geometry?.location.lat);
                console.log('----', details?.geometry?.location.lng);
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
          <View style={styles.searchBox}>
            <Image
              source={require('../assets/search.png')}
              style={styles.searchIcon}
            />
            <GooglePlacesAutocomplete
              GooglePlacesDetailsQuery={{fields: 'geometry'}}
              fetchDetails={true}
              placeholder="Search your place of Arrival"
              enablePoweredByContainer={false}
              onPress={(data, desDetails = null) => {
                const destinationLocation = [
                  {
                    latitude: Number(desDetails?.geometry?.location.lat),
                    longitude: Number(desDetails?.geometry?.location.lng),
                  },
                ];
                setDestinationCoordinates(destinationLocation);
                setDestinationName(data.description);

                // Use current location and destination data for each page and store it in the reader's repository
                dispatch(
                  directionSlice.actions.setArrivalPosition({
                    arrivalPosition: {
                      latitude: desDetails?.geometry?.location.lat,
                      longitude: desDetails?.geometry?.location.lng,
                    },
                  }),
                );

                console.log('des--', desDetails?.geometry?.location.lat);
                console.log('des--', desDetails?.geometry?.location.lng);

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
          <ScrollView horizontal={true} style={styles.polygonContainer}>
            {crimetype.map((item, index) => {
              return (
                <View
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
  test: {
    display: 'flex',
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
  polygonContainer: {
    paddingBottom: 13,
  },
  crimeButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 120,
    height: 30,
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

export default Search;
