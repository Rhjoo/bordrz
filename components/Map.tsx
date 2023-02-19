import { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView from 'react-native-maps';

const Map = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [delta, setDelta] = useState(180);
  const [address, setAddress] = useState({});

  const [permission, setPermission] = useState(true);

  useEffect(() => {
    // to use async inside useEffect, use async function inside
    // not useEffect( async () => {})
    // here we use immediately invoked function
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log(status);
      if (status !== "granted") {
        console.log("PERMISSION NOT GRANTED!");
        // TODO: create a component to say user needs to give permission
        setPermission(false);
      }
    })();
  }, []);

  const main = permission ? (
    <>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          getLocation();
        }}
        >
        <Text>Get Your Coordinates</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          getLocationAndGeocode();
        }}
        >
        <Text>Get Your Location</Text>
      </TouchableOpacity>
          <Text>
            {location.latitude} {location.longitude}
          </Text>
      <Text>{JSON.stringify(address, null, 2)}</Text>
      {/* TODO: instead of JSON, turn it into list
          TODO: once pressed, the button should be grayed out, maybe some spinning animation? */}
    </>
  ) : (
    <>
      <Text>Please allow location permission in the settings</Text>
    </>
  );

  // TODO: Need to combine getLocation and getGeocode, so you don't display 
  // TODO: the coordinates
  const getLocation = async () => {
    let position = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setDelta(0.01);
    // console.log("getLocation() ran");
  };

  const getGeocode = async () => {
    const reverseGeocodeLocation = await Location.reverseGeocodeAsync({
      longitude: location.longitude,
      latitude: location.latitude,
    });
    // console.log(reverseGeocodeLocation);
    setAddress(reverseGeocodeLocation);
  };

  const getLocationAndGeocode = async () => {
    getLocation();
    let positionInsideNewCode = await Location.getCurrentPositionAsync({});
    const reverseGeocodeLocation = await Location.reverseGeocodeAsync({
      longitude: positionInsideNewCode.coords.longitude,
      latitude: positionInsideNewCode.coords.latitude,
    });
    // console.log(reverseGeocodeLocation);
    setAddress(reverseGeocodeLocation);
  }

  return (
    <>
      {/* <Text>Hi, I'm Map component</Text> */}
      <MapView style={styles.map} 
        showsUserLocation={true}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta
        }}
      />
      {main}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 25,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#DDDDDD",
  },
  map: {
    width: "100%",
    height: "40%",
  }
});

export default Map;
