import { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [delta, setDelta] = useState(180);
  const [address, setAddress] = useState<Location.LocationGeocodedAddress[]>([]);
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
        setPermission(false);
      }
    })();
  }, []);

  const button = permission ? (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          getLocationAndGeocode();
        }}
        >
        <Text>Get Your Location</Text>
      </TouchableOpacity>
      {/*TODO: once pressed, the button should be grayed out, maybe some spinning animation? */}
      {/* <Text>{location.latitude} {location.longitude}</Text> */}
      {/* <Text>{JSON.stringify(address, null, 2)}</Text> */}
 </>
  ) : (
    <>
      <Text>Please allow location permission in the settings</Text>
    </>
  );
  
  const list = address.length !== 0 ? (
    <>
      {console.log(address)}
      
      <Text>{address[0].city}</Text>
      <Text>{address[0].postalCode}</Text>
      <Text>{address[0].subregion}</Text>
      <Text>{address[0].region}</Text>
      <Text>{address[0].country}</Text>
    </>
  ) : (
    <>
      <Text>Empty list</Text>
    </>
  )

  const getLocationAndGeocode = async () => {
    let position = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setDelta(0.01);
    const locationGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    });
    setAddress(locationGeocodedAddress);
  }

  return (
    <>
      <MapView style={styles.map} 
        showsUserLocation={true}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta
        }}
      >
        <Marker coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
          // @ts-ignore
          latitudeDelta: delta,
          longitudeDelta: delta
        }} />
      </MapView>
      {button}
      {list}
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
