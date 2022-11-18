import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Linking,
  Alert,
} from 'react-native';
import {useCallback, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NaviPageParamList} from '../pages/NaviPage';

export interface DircetionSheetProps {
  destination: string;
}

const DirectionSheet = () => {
  const navigation = useNavigation<NavigationProp<NaviPageParamList>>();
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
  const onDirection = useCallback(() => {
    navigation.navigate('Direction');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View
          style={StyleSheet.compose(styles.naviButton, styles.directionButton)}>
          <Text
            style={StyleSheet.compose(
              styles.naviButtonText,
              styles.directionButtonText,
            )}
            onPress={() => {
              onDirection();
            }}>
            Fastest{'\n'}Route
          </Text>
        </View>
        <View
          style={StyleSheet.compose(styles.naviButton, styles.directionButton)}>
          <Text
            style={StyleSheet.compose(
              styles.naviButtonText,
              styles.directionButtonText,
            )}
            onPress={() => {
              onDirection();
            }}>
            Shortest{'\n'}Route
          </Text>
        </View>
        <View
          style={StyleSheet.compose(styles.naviButton, styles.directionButton)}>
          <Text
            style={StyleSheet.compose(
              styles.naviButtonText,
              styles.directionButtonText,
            )}
            onPress={() => {
              onDirection();
            }}>
            Default{'\n'}Route
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

  buttonContainer: {
    width: '100%',
    height: 250,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  naviButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4255FF',
    width: 100,
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

export default DirectionSheet;
