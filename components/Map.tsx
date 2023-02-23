import { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Polygon } from 'react-native-maps';

const Map = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [delta, setDelta] = useState(180);
  const [address, setAddress] = useState<Location.LocationGeocodedAddress[]>([]);
  const [permission, setPermission] = useState(true);
  const [borders, setBorders] = useState([]);

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
        <Text style={styles.text}>Get Your Location</Text>
      </TouchableOpacity>
      {/*TODO: once pressed, the button should be grayed out, maybe some spinning animation? */}
      {/* <Text>{location.latitude} {location.longitude}</Text> */}
      {/* <Text>{JSON.stringify(address, null, 2)}</Text> */}
      <TouchableOpacity style={styles.button} onPress={() => getBorders()}>
        <Text style={styles.text}>Put border</Text>
      </TouchableOpacity>
 </>
  ) : (
    <>
      <Text>Please allow location permission in the settings</Text>
    </>
  );
  
  const list = address.length !== 0 ? (
    <>
      {console.log(address)}
      
      <Text style={styles.item}>City: {address[0].city}</Text>
      <Text style={styles.item}>Zip Code: {address[0].postalCode}</Text>
      <Text style={styles.item}>County: {address[0].subregion}</Text>
      <Text style={styles.item}>State: {address[0].region}</Text>
      <Text style={styles.item}>Country: {address[0].country}</Text>
    </>
  ) : (
    <>
      <Text style={styles.list}>Empty list</Text>
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

  const getBorders = () => {
    try {
      fetch(
        `https://nominatim.openstreetmap.org/search.php?q=${address[0].city}+${address[0].region}&polygon_geojson=1&format=json`
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          return data[0].geojson.coordinates[0].map(function(array: any) {
            let object = {};
            object = {latitude: array[1], longitude: array[0]};
            return object;
          });
        })
        .then(result => {
          setBorders(result);
          // setError(null);
        })
    } 
    catch {
      console.log('There was an error fetching borders');
      // setError('There was an error fetching borders');
    }
  };

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
        <Polygon coordinates={borders} fillColor="rgba(255, 0, 0, 0.2)" strokeColor={"red"} strokeWidth={1} />
      </MapView>
      {button}
      {list}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#DDDDDD",
    borderRadius: 10,
    margin: 7,
    padding: 2,
    justifyContent: "center"
  },
  text: {
    textAlign: "center",
    fontFamily: "Verdana",
    fontSize: 30,
    fontWeight: "500"
  },
  list: {
    display: "none"
  },
  item: {
    height: 60,
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 7,
    margin: 2,
    padding: 10,
    textAlign: "center", 
    fontFamily: "Verdana",
    fontSize: 25
  },
  map: {
    width: "100%",
    height: "40%",
  }
});

export default Map;
