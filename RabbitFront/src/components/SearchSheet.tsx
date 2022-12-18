// The Search sheet component code of bottom sheet modal

import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useCallback, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NaviPageParamList} from '../pages/NaviPage';
import axios, {AxiosError} from 'axios';
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

//  The main function of Search sheet Page
const SearchSheet = (
  {destination}: SearchSheetProps,
  {destinationCoordinate}: SearchSheetProps,
) => {
  const navigation = useNavigation<NavigationProp<NaviPageParamList>>();
  // Codes to store status values
  const [loading, setLoading] = useState(false);
  // Code to load values from global storage
  const departurePosition = useSelector(
    (state: RootState) => state.direction.departurePosition,
  );
  const arrivalPosition = useSelector(
    (state: RootState) => state.direction.arrivalPosition,
  );

  // Code to communicate with global repository(Redux)
  const dispatch = useAppDispatch();

  // The function that stores the coordinate values of the recommendation route received from the server in the global repository
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
    dispatch(
      waypointSlice.actions.setWaypointRiskiness({
        safeWaypointRiskiness: [
          response.data.safe.total_riskiness,
          response.data.safe.length,
        ],
        safetestWaypointRiskiness: [
          response.data.safetest.total_riskiness,
          response.data.safetest.length,
        ],
        shortWaypointRiskiness: [
          response.data.short.total_riskiness,
          response.data.short.length,
        ],
        shortestWaypointRiskiness: [
          response.data.shortest.total_riskiness,
          response.data.shortest.length,
        ],
      }),
    );
  }, []);

  // Code executed when the Direction request button is clicked
  const onDirection = useCallback(async () => {
    // Code to load UserId stored in local store
    const userId = await EncryptedStorage.getItem('id');
    // Code that uses axios to communicate with the server to post route coordinate
    try {
      {
        setLoading(true);
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
            id: userId,
          },
        );

        dispatchWaypont(response);
        setLoading(false);

        // Code to go to the path recommendation page at the end of communication with the server
        navigation.navigate('Direction');
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse) {
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
      </View>
    </View>
  );
};

// Css apply Code
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
    height: 60,
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  naviButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4255FF',
    width: 150,
    paddingVertical: 4,
    margin: 10,
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
