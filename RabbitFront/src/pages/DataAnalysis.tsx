// TheData Page Code

import * as React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {Dropdown} from 'react-native-element-dropdown';
import {ScrollView} from 'react-native-gesture-handler';

type SearchScreenProps = NativeStackScreenProps<LoggedInParamList, 'Data'>;

const data = [
  {label: 'Abandoned Building', value: 'Abandoned_Building'},
  {label: 'Abandoned Vehicles', value: 'Abandoned_Vehicles'},
  {label: 'Bus', value: 'Bus'},
  {label: 'Family Support Agency', value: 'Family_Support_Agency'},
  {label: 'Fire Station', value: 'Fire_Station'},
  {label: 'Graffiti Removal Request', value: 'Graffiti_Removal_Request'},
  {label: 'Library', value: 'Library'},
  {label: 'Light Out Request', value: 'Light_Out_Request'},
  {label: 'Police Station', value: 'Police_Station'},
  {label: 'Public School', value: 'Public_School'},
  {label: 'Rodent Baiting Request', value: 'Rodent_Baiting_Request'},
  {label: 'Sanitation Complaint', value: 'Sanitation_Complaint_Request'},
  {label: 'Shot Spotter Alert', value: 'Shot_Spotter_Alert'},
  {label: 'Tree Debris Request', value: 'Tree_Debris_Request'},
  {label: 'Tree Trimes Request', value: 'Tree_Trimes_Request'},
];

//  The main function of Data Analysis Page
function Data({navigation}: SearchScreenProps) {
  const [value, setValue] = useState('Abandoned_Building');
  const [isFocus, setIsFocus] = useState(false);

  // Callback function to draw an image on the screen according to the prop
  const onImage = useCallback(() => {
    switch (value) {
      case 'Abandoned_Building':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Abandoned_Building.png`)}
          />
        );
      case 'Abandoned_Vehicles':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Abandoned_Vehicles.png`)}
          />
        );
      case 'Bus':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Bus.png`)}
          />
        );
      case 'Family_Support_Agency':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Family_Support_Agency.png`)}
          />
        );
      case 'Fire_Station':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Fire_Station.png`)}
          />
        );
      case 'Graffiti_Removal_Request':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Graffiti_Removal_Request.png`)}
          />
        );
      case 'Library':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Library.png`)}
          />
        );
      case 'Light_Out_Request':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Light_Out_Request.png`)}
          />
        );
      case 'Police_Station':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Police_Station.png`)}
          />
        );
      case 'Public_School':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Public_School.png`)}
          />
        );
      case 'Rodent_Baiting_Request':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Rodent_Baiting_Request.png`)}
          />
        );
      case 'Sanitation_Complaint_Request':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Sanitation_Complaint_Request.png`)}
          />
        );
      case 'Shot_Spotter_Alert':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Shot_Spotter_Alert.png`)}
          />
        );
      case 'Tree_Debris_Request':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Tree_Debris_Request.png`)}
          />
        );
      case 'Tree_Trimes_Request':
        return (
          <Image
            style={styles.dataImage}
            source={require(`../assets/dataPage/Tree_Trimes_Request.png`)}
          />
        );
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>
          2018 crime density with urban factor data, which is used to predict
          2019 crime density
        </Text>
        {/* Draw component to select Urban factor */}
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Choose the Urban factor ' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <ScrollView>{onImage()}</ScrollView>
    </View>
  );
}

// CSS Code
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 16,
  },
  scrollv: {
    height: '100%',
    width: 300,
    backgroundColor: 'red',
  },
  headerText: {
    marginHorizontal: 5,
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dataImage: {
    marginTop: 20,
    width: '100%',
    height: 700,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default Data;
