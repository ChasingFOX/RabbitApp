import * as React from 'react';
import {Image, StyleSheet, Text, View, Linking, Alert} from 'react-native';
import {useCallback} from 'react';
import {useAppDispatch} from '../store';
import waypointSlice from '../slices/waypointSlice';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
export interface DircetionSheetProps {
  route: string;
}

const DirectionSheet = ({route}: DircetionSheetProps) => {
  //   const route2 = useRoute<RouteProp<NaviPageParamList, 'Direction'>>();
  //   const navigation = useNavigation<NavigationProp<NaviPageParamList>>();
  const onNavigation = useCallback(() => {
    // if (true) {
    //   Geolocation.getCurrentPosition(
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

    Linking.openURL(
      'https://www.google.com/maps/dir/?api=1&origin=40.42489539482597,-86.91051411560053&destination=40.473360126380996,-86.94642755184898&travelmode=walking&waypoints=40.42119341508705,-86.91781885879092%7C40.42732532443506,-86.92463136381483%7C40.43249524031551,-86.9269298077754%7C40.446337675508566,-86.92821177376851%7C40.45851363603605,-86.93213657343334%7C40.46619283912356,-86.9486192066278%7C40.46716415540354,-86.95429476059878%7C40.47024506180284,-86.95576733520348%7C40.47034248927443,-86.9517606080918%7C40.46857485459526,-86.94694887644629%7C40.47062085295775,-86.939740426341',
    );
  }, []);
  //   console.log('route2.params', route2.params);

  const onDirection = useCallback(() => {}, []);

  const dispatch = useAppDispatch();

  const handleWaypoint = (color: string) => {
    if (color == 'Blue') {
      dispatch(
        waypointSlice.actions.setWaypoint({
          wayPointChecked: [true, false, false, false],
        }),
      );
    }
    if (color == 'Green') {
      dispatch(
        waypointSlice.actions.setWaypoint({
          wayPointChecked: [false, true, false, false],
        }),
      );
    }
    if (color == 'Orange') {
      dispatch(
        waypointSlice.actions.setWaypoint({
          wayPointChecked: [false, false, true, false],
        }),
      );
    }
    if (color == 'Red') {
      dispatch(
        waypointSlice.actions.setWaypoint({
          wayPointChecked: [false, false, false, true],
        }),
      );
    }
  };

  // const waypointButtonClick = useCallback(
  //   (idx: Number) => {
  //     setPolygonButton(prev =>
  //       prev.map((element, index) => {
  //         return index === idx ? !element : false;
  //       }),
  //     );
  //     console.log('polygonButton', polygonButton);
  //   },
  //   [polygonButton],
  // );

  const waypointChecked = useSelector(
    (state: RootState) => state.waypoint.wayPointChecked,
  );

  const arrivalName = useSelector(
    (state: RootState) => state.direction.arrivalName,
  );

  const departureName = useSelector(
    (state: RootState) => state.direction.departureName,
  );

  return (
    <View style={styles.container}>
      <Text
        style={
          styles.headerText
        }>{`From: ${departureName}\nTo: ${arrivalName}`}</Text>
      <View style={styles.buttonContainer}>
        <View
          style={
            waypointChecked[0]
              ? StyleSheet.compose(styles.routeButton, styles.routeButtonActive)
              : styles.routeButton
          }>
          <Text
            style={
              waypointChecked[0]
                ? StyleSheet.compose(
                    styles.routeButtonText,
                    styles.routeButtonTextActive,
                  )
                : styles.routeButtonText
            }
            onPress={() => {
              handleWaypoint('Blue');
            }}>
            Blue{'\n'}Route
          </Text>
        </View>
        <View
          style={
            waypointChecked[1]
              ? StyleSheet.compose(styles.routeButton, styles.routeButtonActive)
              : styles.routeButton
          }>
          <Text
            style={
              waypointChecked[1]
                ? StyleSheet.compose(
                    styles.routeButtonText,
                    styles.routeButtonTextActive,
                  )
                : styles.routeButtonText
            }
            onPress={() => {
              handleWaypoint('Green');
            }}>
            Green{'\n'}Route
          </Text>
        </View>
        <View
          style={
            waypointChecked[2]
              ? StyleSheet.compose(styles.routeButton, styles.routeButtonActive)
              : styles.routeButton
          }>
          <Text
            style={
              waypointChecked[2]
                ? StyleSheet.compose(
                    styles.routeButtonText,
                    styles.routeButtonTextActive,
                  )
                : styles.routeButtonText
            }
            onPress={() => {
              handleWaypoint('Orange');
            }}>
            Orange{'\n'}Route
          </Text>
        </View>
        <View
          style={
            waypointChecked[3]
              ? StyleSheet.compose(styles.routeButton, styles.routeButtonActive)
              : styles.routeButton
          }>
          <Text
            style={
              waypointChecked[3]
                ? StyleSheet.compose(
                    styles.routeButtonText,
                    styles.routeButtonTextActive,
                  )
                : styles.routeButtonText
            }
            onPress={() => {
              handleWaypoint('Red');
            }}>
            Red{'\n'}Route
          </Text>
        </View>
        <Image source={require('../assets/line.png')} style={styles.line} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    marginHorizontal: 15,
    fontSize: 15,
  },
  buttonContainer: {
    width: '100%',
    height: 250,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  routeButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 70,
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
  routeButtonActive: {
    backgroundColor: '#f4511e',
  },
  routeButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeButtonTextActive: {
    color: 'white',
  },
  naviIcon: {
    width: 15,
    height: 18,
    marginRight: 5,
  },
  line: {
    width: 280,
    margin: 15,
  },
});

export default DirectionSheet;
