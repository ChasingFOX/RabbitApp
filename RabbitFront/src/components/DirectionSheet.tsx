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
    Linking.openURL(
      'https://www.google.com/maps/dir/?api=1&origin=40.42489539482597,-86.91051411560053&destination=40.473360126380996,-86.94642755184898&travelmode=walking&waypoints=40.42119341508705,-86.91781885879092%7C40.42732532443506,-86.92463136381483%7C40.43249524031551,-86.9269298077754%7C40.446337675508566,-86.92821177376851%7C40.45851363603605,-86.93213657343334%7C40.46619283912356,-86.9486192066278%7C40.46716415540354,-86.95429476059878%7C40.47024506180284,-86.95576733520348%7C40.47034248927443,-86.9517606080918%7C40.46857485459526,-86.94694887644629%7C40.47062085295775,-86.939740426341',
    );
  }, []);

  const onDirection = useCallback(() => {}, []);

  const dispatch = useAppDispatch();

  const handleWaypoint = (type: string) => {
    if (type == 'Safe') {
      dispatch(
        waypointSlice.actions.setWaypointChecked({
          wayPointChecked: [true, false, false, false],
        }),
      );
    }
    if (type == 'Safetest') {
      dispatch(
        waypointSlice.actions.setWaypointChecked({
          wayPointChecked: [false, true, false, false],
        }),
      );
    }
    if (type == 'Short') {
      dispatch(
        waypointSlice.actions.setWaypointChecked({
          wayPointChecked: [false, false, true, false],
        }),
      );
    }
    if (type == 'Shortest') {
      dispatch(
        waypointSlice.actions.setWaypointChecked({
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
      <Text style={styles.headerText}>
        {`From: ${departureName}\nTo: ${arrivalName}`}
      </Text>
      <Image source={require('../assets/line.png')} style={styles.line} />
      <View style={styles.buttonContainer}>
        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[0]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.routeButtonActive,
                  )
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
                handleWaypoint('Safe');
              }}>
              Safe{'\n'}Route
            </Text>
          </View>
          <View style={styles.naviButton}>
            <Image
              source={require('../assets/naviColor.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.naviButtonText}
              onPress={() => {
                onNavigation();
              }}>
              Navi
            </Text>
          </View>
        </View>

        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[1]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.routeButtonActive,
                  )
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
                handleWaypoint('Safest');
              }}>
              Safetest{'\n'}Route
            </Text>
          </View>
          <View style={styles.naviButton}>
            <Image
              source={require('../assets/naviColor.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.naviButtonText}
              onPress={() => {
                onNavigation();
              }}>
              Navi
            </Text>
          </View>
        </View>
        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[2]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.routeButtonActive,
                  )
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
                handleWaypoint('Short');
              }}>
              Short{'\n'}Route
            </Text>
          </View>
          <View style={styles.naviButton}>
            <Image
              source={require('../assets/naviColor.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.naviButtonText}
              onPress={() => {
                onNavigation();
              }}>
              Navi
            </Text>
          </View>
        </View>
        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[3]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.routeButtonActive,
                  )
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
                handleWaypoint('Shortest');
              }}>
              Shortest{'\n'}Route
            </Text>
          </View>
          <View style={styles.naviButton}>
            <Image
              source={require('../assets/naviColor.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.naviButtonText}
              onPress={() => {
                onNavigation();
              }}>
              Navi
            </Text>
          </View>
        </View>
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
  naviContainer: {
    display: 'flex',
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
  naviButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 70,
    marginHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
  naviButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeButtonTextActive: {
    color: 'white',
  },
  naviIcon: {
    width: 10,
    height: 13,
    marginRight: 5,
  },
  line: {
    width: '100%',
    marginVertical: 7,
  },
});

export default DirectionSheet;
