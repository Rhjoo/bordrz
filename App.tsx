// import { StatusBar } from 'expo-status-bar';
import Map from "./components/Map";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Map />
    </SafeAreaView>
    // TODO: implement SafeAreaView for Android 
    // https://stackoverflow.com/questions/51289587/how-to-use-safeareaview-for-android-notch-devices
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
