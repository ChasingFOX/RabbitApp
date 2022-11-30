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
import polygonData from '../constants/polygone.json';
import polygonData2 from '../constants/crime_polygon_vector.json';
import polygonData3 from '../constants/crime_polygon_vector_change.json';
import polygonData4 from '../constants/crime_polygon_vector_dict4.json';
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

  const [polygon, setPolygon] = useState();

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

  const [polygonTest, setPolygonTest] = useState(
    JSON.parse(String(polygonData4)).Assualt,
  );

  const onAssualtPolygon = () => {
    setPolygonTest(JSON.parse(String(polygonData4)).Assualt);
  };

  const onBatteryPolygon = () => {
    setPolygonTest(JSON.parse(String(polygonData4)).Battery);
  };

  const testPolygon = () => {
    polygonCoordinates.map((item, index) => {
      console.log('item', item);
      return (
        <Polygon
          coordinates={item}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          fillColor="rgba(256,26,20,.3)"
          strokeWidth={1}
        />
      );
    });
  };

  return (
    <BottomSheetModalProvider>
      <View style={{height: '100%', flex: 1, justifyContent: 'flex-start'}}>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={['25%', '50%']}
          onChange={handleSheetChanges}>
          <SearchSheet destination={destinationName} />
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

          {/* Code to make polygon area */}
          {/* { <Polygon
            coordinates={polygonCoordinates[0]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            fillColor="rgba(256,26,20,.3)"
            strokeWidth={1}
          />} */}

          {polygonTest.map((item: LatLng[]) => {
            console.log('item', item);
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
              placeholder="Search"
              onPress={(data, details = null) => {
                console.log('dgl-lat', details?.geometry?.location.lat);
                console.log('dgl-lng', details?.geometry?.location.lng);
                const destinationLocation = [
                  {
                    latitude: Number(details?.geometry?.location.lat),
                    longitude: Number(details?.geometry?.location.lng),
                  },
                ];

                setDestinationCoordinates(destinationLocation);

                console.log('dd', JSON.stringify(details?.geometry?.location));

                console.log('latitude', typeof latitude);

                console.log('------', details);

                console.log('data', data.description);

                setDestinationName(data.description);

                console.log(data);

                // Use current location and destination data for each page and store it in the reader's repository
                dispatch(
                  directionSlice.actions.setDirection({
                    destination: {
                      lat: details?.geometry?.location.lat,
                      lng: details?.geometry?.location.lng,
                    },
                    currentPosition: {
                      lat: currentLatitude,
                      lng: currentLongitude,
                    },
                  }),
                );

                console.log('=====', details?.geometry?.location.lat);
                console.log('=====', typeof details?.geometry?.location.lat);
                console.log('..', currentLatitude);
                console.log('..', typeof currentLatitude);

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
            <View style={styles.crimeButton}>
              <Text onPress={onBatteryPolygon}>'Assualt'</Text>
            </View>
            <View style={styles.crimeButton}>
              <Text>'1'</Text>
            </View>
            <View style={styles.crimeButton}>
              <Text>'2'</Text>
            </View>
            <View style={styles.crimeButton}>
              <Text>'3'</Text>
            </View>
            <View style={styles.crimeButton}>
              <Text>'4'</Text>
            </View>
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
    backgroundColor: 'white',
    width: 90,
    height: 25,
    paddingVertical: 5,
    margin: 5,
    alignItems: 'center',
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
