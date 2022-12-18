// The Direction sheet component code of bottom sheet modal

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

//  The main function of Direction sheet Page
const DirectionSheet = ({route}: DircetionSheetProps) => {
  // Code to communicate with global repository(Redux)
  const dispatch = useAppDispatch();
  // Code that changes the value of the global repository each time a path is selected
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

  // Code to load values from global storage
  const waypointChecked = useSelector(
    (state: RootState) => state.waypoint.wayPointChecked,
  );
  const arrivalName = useSelector(
    (state: RootState) => state.direction.arrivalName,
  );
  const arrivalPosition = useSelector(
    (state: RootState) => state.direction.arrivalPosition,
  );
  const departureName = useSelector(
    (state: RootState) => state.direction.departureName,
  );
  const departurePosition = useSelector(
    (state: RootState) => state.direction.departurePosition,
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
  const safeWaypointRiskiness = useSelector(
    (state: RootState) => state.waypoint.safeWaypointRiskiness,
  );
  const safetestWaypointRiskiness = useSelector(
    (state: RootState) => state.waypoint.safetestWaypointRiskiness,
  );
  const shortWaypointRiskiness = useSelector(
    (state: RootState) => state.waypoint.shortWaypointRiskiness,
  );
  const shortestWaypointRiskiness = useSelector(
    (state: RootState) => state.waypoint.shortestWaypointRiskiness,
  );

  // The function executed when the navigation button is clicked
  const onNavigation = useCallback(routeType => {
    // Code to preprocess Waypoint values and forward them to Google Map App
    let naviWaypoint: (string | number)[] = [];
    routeType.map((item: {latitude: number; longitude: number}) => {
      naviWaypoint.push(item.latitude);
      naviWaypoint.push(item.longitude);
      naviWaypoint.push('%7C');
    });
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${
        departurePosition.latitude
      },${departurePosition.longitude}&destination=${
        arrivalPosition.latitude
      },${arrivalPosition.longitude}&travelmode=walking&waypoints=${naviWaypoint
        .join()
        .replace(/,%7C,/g, '%7C')
        .replace(',%7C', '')}`,
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{`From - \nTo -`}</Text>
        <Text style={styles.headerText}>
          {`${departureName}\n${arrivalName}`}
        </Text>
      </View>
      <Image source={require('../assets/line.png')} style={styles.line} />
      <View style={styles.buttonContainer}>
        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[1]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.safestButtonActive,
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
                handleWaypoint('Safetest');
              }}>
              Route 1
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
                onNavigation(safetestWaypoint);
              }}>
              Navi
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Image
              source={require('../assets/warning.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {safetestWaypointRiskiness[0]}
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {safetestWaypointRiskiness[1]}m
            </Text>
          </View>
        </View>

        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[0]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.safeButtonActive,
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
              Route 2
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
                onNavigation(safeWaypoint);
              }}>
              Navi
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Image
              source={require('../assets/warning.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {safeWaypointRiskiness[0]}
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {safeWaypointRiskiness[1]}m
            </Text>
          </View>
        </View>

        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[2]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.shortButtonActive,
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
              Route 3
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
                onNavigation(shortWaypoint);
              }}>
              Navi
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Image
              source={require('../assets/warning.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {shortWaypointRiskiness[0]}
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {shortWaypointRiskiness[1]}m
            </Text>
          </View>
        </View>
        <View style={styles.naviContainer}>
          <View
            style={
              waypointChecked[3]
                ? StyleSheet.compose(
                    styles.routeButton,
                    styles.shortestButtonActive,
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
              Route 4
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
                onNavigation(shortestWaypoint);
              }}>
              Navi
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Image
              source={require('../assets/warning.png')}
              style={styles.naviIcon}
            />
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {shortestWaypointRiskiness[0]}
            </Text>
          </View>
          <View style={styles.riskinessButton}>
            <Text
              style={styles.riskinessButtonText}
              onPress={() => {
                onNavigation(safeWaypoint);
              }}>
              {shortestWaypointRiskiness[1]}m
            </Text>
          </View>
        </View>
        <Image
          source={require('../assets/spectrum.png')}
          style={styles.spectrumIcon}
        />
      </View>
    </View>
  );
};

// Css apply Code
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    marginLeft: 20,
    marginRight: 10,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  headerText: {
    fontSize: 15,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonContainer: {
    width: '100%',
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  naviContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  routeButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 70,
    height: 40,
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
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'blue',
    width: 60,
    marginHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskinessButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 70,
    marginHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskinessButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  safeButtonActive: {
    backgroundColor: 'rgba(239, 188, 5, 1)',
    shadowOffset: {width: 0, height: 0},
    shadowColor: 'black',
  },
  safestButtonActive: {
    backgroundColor: 'rgba(87, 148, 102, 1)',
  },
  shortButtonActive: {
    backgroundColor: 'rgba(255, 129, 57, 0.95)',
  },
  shortestButtonActive: {
    backgroundColor: 'rgba(255, 9, 9, 0.95)',
  },
  routeButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  naviButtonText: {
    color: 'blue',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeButtonTextActive: {
    color: 'white',
  },
  naviIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  spectrumIcon: {
    margin: 10,
    width: 360,
    height: 23,
  },
  line: {
    width: '100%',
    marginVertical: 7,
  },
});

export default DirectionSheet;
