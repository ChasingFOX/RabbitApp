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
  Alert,
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
import {ScrollView} from 'react-native-gesture-handler';
import Config from 'react-native-config';

type SearchScreenProps = NativeStackScreenProps<NaviPageParamList, 'Search'>;

function Search({navigation}: SearchScreenProps) {
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLongitude] = useState(Number);
  const [currentLatitude, setCurrentLatitude] = useState(Number);
  const [currentLongitude, setCurrentLongitude] = useState(Number);
  const [arrivalCoordinates, setArrivalCoordinates] = useState([
    {latitude: 0, longitude: 0},
  ]);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: 0, longitude: 0},
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
    if (index == -1) {
      Alert.alert('Please re-enter your Departure and Destination');
      setData();
    }
  }, []);
  // Code to get current location

  useEffect(() => {
    setData();
  }, []);

  const setData = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);
        setLatitude(Number(latitude));
        setLongitude(Number(longitude));
        // 해결해야됨 왜 무한 렌더링이 되지?

        // setCurrentLatitude(Number(latitude));
        // setCurrentLongitude(Number(longitude));
        setDestinationCoordinates([
          {
            latitude: Number(latitude),
            longitude: Number(longitude),
          },
        ]);
        dispatch(
          directionSlice.actions.setDeparturePosition({
            departurePosition: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          }),
        );
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000},
    );
  }, [latitude, longitude, destinationCoordinates]);

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
          snapPoints={['25%', '25%']}
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
          <SearchSheet
            destination={destinationName}
            destinationCoordinate={destinationCoordinates}
          />
        </BottomSheetModal>
        {/* Code to get Google Map on the Background*/}
        <MapView
          style={styles.map}
          provider={
            // Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            PROVIDER_GOOGLE
          }
          region={{
            latitude: destinationCoordinates[0].latitude,
            longitude: destinationCoordinates[0].longitude,
            latitudeDelta: 0.07,
            longitudeDelta: 0.001,
          }}
          onRegionChangeComplete={() => {}}
          showsUserLocation={true}>
          {}

          <Marker coordinate={destinationCoordinates[0]} />

          {/* <Polygon
                coordinates={[]}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                fillColor="rgba(256,26,20,.3)"
                strokeWidth={1}
              /> */}
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
                key: Config.GOOGLE_API_URL,
                language: 'en',
              }}
              placeholder="Current Position"
              onPress={(data, details = null) => {
                // Use current location and destination data for each page and store it in the reader's repository
                const destinationLocation = [
                  {
                    latitude: Number(details?.geometry?.location.lat),
                    longitude: Number(details?.geometry?.location.lng),
                  },
                ];

                console.log('----', details?.geometry?.location.lat);
                console.log('----', details?.geometry?.location.lng);

                //출발지 테스트

                setDestinationCoordinates(destinationLocation);
                console.log('destCoord', destinationCoordinates);

                dispatch(
                  directionSlice.actions.setDeparturePosition({
                    departurePosition: {
                      latitude: details?.geometry?.location.lat,
                      longitude: details?.geometry?.location.lng,
                    },
                  }),
                );
                dispatch(
                  directionSlice.actions.setDepartureName({
                    departureName: data.structured_formatting.main_text,
                  }),
                );
                // console.log('----', details?.geometry?.location.lat);
                // console.log('----', details?.geometry?.location.lng);
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
                dispatch(
                  directionSlice.actions.setArrivalName({
                    arrivalName: data.structured_formatting.main_text,
                  }),
                );

                bottomSheetRef.current?.present();
              }}
              query={{
                key: Config.GOOGLE_API_URL,
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
