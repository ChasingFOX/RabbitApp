// The Main Tab Code

import * as React from 'react';
import {Text, View, StyleSheet, Image, Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polygon,
  LatLng,
} from 'react-native-maps';
import {NaviPageParamList} from './NaviPage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import SearchSheet from '../components/SearchSheet';
import {useAppDispatch} from '../store';
import directionSlice from '../slices/directionSlice';
import polygonData from '../constants/chicagoCrimeBoundary.json';
import {ScrollView} from 'react-native-gesture-handler';
import Config from 'react-native-config';
import chicagoPolygonData from '../constants/chicagoBoundary.json';

type SearchScreenProps = NativeStackScreenProps<NaviPageParamList, 'Search'>;

// The main function of Main page
function Search({navigation}: SearchScreenProps) {
  // Codes to store status values
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLongitude] = useState(Number);
  const [destinationName, setDestinationName] = useState<string>('');
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    {latitude: 0, longitude: 0},
  ]);
  // Mandatory coordinates to get a safety route
  const [polygonCoordinates, setPolygonCoordinates] = useState(
    JSON.parse(String(polygonData)).Assualt,
  );
  const [delta, setDelta] = useState(0.7);
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

  // Code to communicate with global repository(Redux)
  const dispatch = useAppDispatch();

  // The callbacks function that tells you if the bottom sheet is loaded.
  const handleSheetChanges = useCallback((index: number) => {
    if (index == -1) {
      Alert.alert('Please re-enter your Departure and Destination');
      setData();
    }
  }, []);

  // Code that is called only once when the direction page is loaded.
  useEffect(() => {
    setData();
  }, []);

  const setData = useCallback(() => {
    // Code to get current location using Geolocation library.
    Geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);
        setLatitude(Number(latitude));
        setLongitude(Number(longitude));
        setDestinationCoordinates([
          {
            latitude: 41.860204751890926,
            longitude: -87.6715530335327,
          },
        ]);
        // Code Store your current location in a global storage
        dispatch(
          directionSlice.actions.setDeparturePosition({
            departurePosition: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          }),
        );
      },
      error => {},
      {enableHighAccuracy: true, timeout: 50000, maximumAge: 10000},
    );
  }, [latitude, longitude, destinationCoordinates]);

  // The function to draw a crime risk polygon when user clicks the polygon button.
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

  // Code to change the polygon button color when user clicks the polygon button.
  const polygonButtonClick = useCallback(
    (idx: Number) => {
      setPolygonButton(prev =>
        prev.map((element, index) => {
          return index === idx ? !element : false;
        }),
      );
    },
    [polygonButton],
  );

  return (
    <BottomSheetModalProvider>
      <View style={{height: '100%', flex: 1, justifyContent: 'flex-start'}}>
        {/* Bottom seat modal that appears when the origin and destination are entered */}
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
          {/* Components drawn within the bottom sheet modal.
           The destination name and coordinates of the destination are Transferred to Props. */}
          <SearchSheet
            destination={destinationName}
            destinationCoordinate={destinationCoordinates}
          />
        </BottomSheetModal>
        {/* Code to get Google Map on the Background*/}
        <MapView
          style={styles.map}
          showsMyLocationButton={true}
          showsUserLocation={true}
          followsUserLocation
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: destinationCoordinates[0].latitude,
            longitude: destinationCoordinates[0].longitude,
            latitudeDelta: delta,
            longitudeDelta: delta,
          }}
          onRegionChangeComplete={() => {}}>
          <Marker coordinate={destinationCoordinates[0]} />
          {/* Code to draw polygons all over Chicago */}
          <Polygon
            coordinates={chicagoPolygonData}
            strokeColor="black" // fallback for when `strokeColors` is not supported by the map-provider
            fillColor="rgba(0, 0, 0, 0.05)"
            strokeWidth={1}
          />
          {/* Code for navigating the coordinates of the Chicago area range using a repeat statement */}
          {polygonCoordinates.map((item: LatLng[], index: number) => {
            return (
              <Polygon
                key={index}
                coordinates={item}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                fillColor="rgba(256,26,20,.2)"
                strokeWidth={1}
              />
            );
          })}
        </MapView>
        {/* Code to search departure coordinate */}
        <View style={styles.container}>
          <View style={styles.searchBox}>
            <Image
              source={require('../assets/search.png')}
              style={styles.searchIcon}
            />
            {/* Code to search for locations using GooglePlacesAutocomplete library */}
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
                setDelta(0.005);
                setDestinationCoordinates(destinationLocation);
                // Code Store departure coordinate in a global storage
                dispatch(
                  directionSlice.actions.setDeparturePosition({
                    departurePosition: {
                      latitude: details?.geometry?.location.lat,
                      longitude: details?.geometry?.location.lng,
                    },
                  }),
                );
                // Code Store departure name in a global storage
                dispatch(
                  directionSlice.actions.setDepartureName({
                    departureName: data.structured_formatting.main_text,
                  }),
                );
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
          {/* Code to search destination coordinate */}
          <View style={styles.searchBox}>
            <Image
              source={require('../assets/search.png')}
              style={styles.searchIcon}
            />
            {/* Code to search for locations using GooglePlacesAutocomplete library */}
            <GooglePlacesAutocomplete
              GooglePlacesDetailsQuery={{fields: 'geometry'}}
              fetchDetails={true}
              placeholder="Search your place of Arrival"
              enablePoweredByContainer={false}
              onPress={(data, desDetails = null) => {
                // Use current location and destination data for each page and store it in the reader's repository
                const destinationLocation = [
                  {
                    latitude: Number(desDetails?.geometry?.location.lat),
                    longitude: Number(desDetails?.geometry?.location.lng),
                  },
                ];
                setDestinationCoordinates(destinationLocation);
                setDestinationName(data.description);
                setDelta(0.005);
                // Code Store destination coordinate in a global storage
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
                // Code that shows Bottom seat modal when destination is entered
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
          {/* Code for displaying polygon buttons */}
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
  container: {
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

export default Search;
