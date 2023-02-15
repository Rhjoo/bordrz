import { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";

const Map = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
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
      {/* TODO: Put a map here */}
      <Text>
        {location.latitude} {location.longitude}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          getLocation();
        }}
      >
        <Text>Get Your Coordinates</Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(address, null, 2)}</Text>
      {/* TODO: instead of JSON, turn it into list
          TODO: once pressed, the button should be grayed out, maybe some spinning animation? */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          getGeocode();
        }}
      >
        <Text>Get Your Location</Text>
      </TouchableOpacity>
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

  return (
    <>
      <Text>Hi, I'm Map component</Text>
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
});

export default Map;
