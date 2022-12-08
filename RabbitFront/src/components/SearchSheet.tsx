import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useCallback, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NaviPageParamList} from '../pages/NaviPage';
import axios, {AxiosError, AxiosResponse} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';
import waypointSlice from '../slices/waypointSlice';

export interface SearchSheetProps {
  destination: string;
  destinationCoordinate: {};
}

const SearchSheet = (
  {destination}: SearchSheetProps,
  {destinationCoordinate}: SearchSheetProps,
) => {
  const navigation = useNavigation<NavigationProp<NaviPageParamList>>();
  const [loading, setLoading] = useState(false);
  const departurePosition = useSelector(
    (state: RootState) => state.direction.departurePosition,
  );
  const arrivalPosition = useSelector(
    (state: RootState) => state.direction.arrivalPosition,
  );

  const dispatch = useAppDispatch();

  const dispatchWaypont = useCallback(response => {
    dispatch(
      waypointSlice.actions.setWaypoint({
        safeWaypoint: response.data.safe.waypoint,
        safetestWaypoint: response.data.safetest.waypoint,
        shortWaypoint: response.data.short.waypoint,
        shortestWaypoint: response.data.shortest.waypoint,
      }),
    );
    dispatch(
      waypointSlice.actions.setWaypointChecked({
        wayPointChecked: [true, true, true, true],
      }),
    );
    console.log('---dispatchWaypoint---', response.data.short.waypoint);
  }, []);

  const onNavigation = useCallback(() => {
    // if (true) {
    //   Geolocation.getdeparturePosition(
    //     position => {
    //       console.log(position);
    //     },
    //     error => {
    //       // See error code charts below.
    //       console.log(error.code, error.message);
    //     },
    //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    //   );
    // }
    // Linking.openURL(
    //   'https://www.google.com/maps/dir/?api=1&origin=40.42489539482597,-86.91051411560053&destination=40.473360126380996,-86.94642755184898&travelmode=walking&waypoints=40.42119341508705,-86.91781885879092%7C40.42732532443506,-86.92463136381483%7C40.43249524031551,-86.9269298077754%7C40.446337675508566,-86.92821177376851%7C40.45851363603605,-86.93213657343334%7C40.46619283912356,-86.9486192066278%7C40.46716415540354,-86.95429476059878%7C40.47024506180284,-86.95576733520348%7C40.47034248927443,-86.9517606080918%7C40.46857485459526,-86.94694887644629%7C40.47062085295775,-86.939740426341',
    // );
  }, []);

  console.log('departurePosition', departurePosition);
  console.log('arrivalPosition', arrivalPosition);

  const onDirection = useCallback(async () => {
    const userId = await EncryptedStorage.getItem('id');
    try {
      {
        setLoading(true);
        console.log('search-dep', departurePosition);
        console.log('search-arr', arrivalPosition);
        const response = await axios.post(
          `${Config.DIRECTION_API_URL}/api/navi`,
          {
            orig: {
              latitude: departurePosition.latitude,
              longitude: departurePosition.longitude,
            },
            dest: {
              latitude: arrivalPosition.latitude,
              longitude: arrivalPosition.longitude,
            },
            id: 88,
          },
        );

        console.log('response', response);
        console.log('response.data.short.waypoint', response.data);
        console.log(
          'response.data.shortest.waypoint',
          response.data.shortest.waypoint,
        );
        console.log('response.data.safe.waypoint', response.data.safe.waypoint);
        console.log(
          'response.data.safetest.waypoint',
          response.data.safetest.waypoint,
        );

        dispatchWaypont(response);
        setLoading(false);

        navigation.navigate('Direction');
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.log('error');

      if (errorResponse) {
        console.log('error', errorResponse);
        Alert.alert('error', errorResponse.data);
      }
      setLoading(false);
    } finally {
    }
  }, [loading, departurePosition, arrivalPosition]);

  return (
    <View style={styles.container}>
      <TouchableHighlight>
        <Text style={styles.destinationText}>{destination}</Text>
      </TouchableHighlight>

      <View style={styles.buttonContainer}>
        <View style={styles.naviButton}>
          <Image
            source={require('../assets/navigation.png')}
            style={styles.naviIcon}
          />
          <Text
            style={styles.naviButtonText}
            onPress={() => {
              onNavigation();
            }}>
            Navigation
          </Text>
        </View>
        <View
          style={StyleSheet.compose(styles.naviButton, styles.directionButton)}>
          <Image
            source={require('../assets/direction.png')}
            style={styles.directionIcon}
          />
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text
              style={StyleSheet.compose(
                styles.naviButtonText,
                styles.directionButtonText,
              )}
              onPress={() => {
                onDirection();
              }}>
              Direction
            </Text>
          )}
        </View>
        <Image source={require('../assets/line.png')} style={styles.line} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  destinationText: {
    margin: 15,
    fontSize: 17,
  },
  buttonContainer: {
    width: 350,
    height: 250,
    display: 'flex',
    backgroundColor: 'white',
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 7},
    shadowOpacity: 0.3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  naviButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4255FF',
    width: 150,
    paddingVertical: 4,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    shadowOffset: {width: 1, height: 3},
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  directionButton: {
    backgroundColor: 'white',
  },
  naviButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  directionButtonText: {
    color: 'black',
  },
  naviIcon: {
    width: 15,
    height: 18,
    marginRight: 5,
  },
  directionIcon: {
    width: 14,
    height: 21,
    marginRight: 5,
  },
  line: {
    width: 280,
    margin: 15,
  },
});

export default SearchSheet;
