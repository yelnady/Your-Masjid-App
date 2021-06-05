import React, { useEffect, useState, useContext } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Linking,
} from "react-native";
import { version } from "./package.json";
import Autolink from "react-native-autolink";
import Slider from "@react-native-community/slider";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { YourMasjidContext } from "./Provider";

function Seprator() {
  return (
    <View
      style={{
        borderColor: greyColor,
        borderBottomWidth: 1,
        paddingVertical: 4,
      }}
    />
  );
}
function MySwitch(props) {
  return (
    <Switch
      trackColor={{ false: "#767577", true: "rgba(0,180,140,1)" }}
      thumbColor={props.value ? "rgba(0,137,142,1)" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={props.onValueChange}
      value={props.value}
      style={styles.switchh}
    />
  );
}
const greyColor = "rgba(156,152,152,100)";

export default function Settings({ navigation }) {
  //Making use of the "YourMasjidContext" from the Provider.js file
  const Ctxt = useContext(YourMasjidContext);
  const toggleHijriCorrect = async (val) => {
    await AsyncStorage.setItem("HijriCorrect", JSON.stringify(val));
    Ctxt.setHijriCorrect(val);
  };
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.TheBigTitle}>Settings</Text>

      <ScrollView style={styles.scroll}>
        <Text style={[styles.AzanTitle, { marginLeft: 10, marginTop: 10 }]}>
          Correct Hijri Date ({Ctxt.HijriCorrect})
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-4}
          maximumValue={4}
          thumbTintColor="rgba(0,137,142,1)"
          step={1}
          animateTransitions={true}
          value={Ctxt.HijriCorrect}
          minimumTrackTintColor="rgba(0,137,142,1)"
          maximumTrackTintColor="gray"
          onValueChange={toggleHijriCorrect}
        />


      </ScrollView>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          // onPress={() => Linking.openURL("Put Your Website address")}
          activeOpacity={0.5}
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            width: 64,
            height: 64,
            backgroundColor: "white",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("./assets/round.png")}
            style={{
              width: 66,
              height: 66,
            }}
          />
        </TouchableOpacity>
      </View>
      <Autolink text={"Version " + version} style={styles.smallText}></Autolink>
      {/* Following is the bottom bar components */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.5}
        accessibilityHint="settings"
        style={{
          borderRadius: 50,
          width: 65,
          height: 65,
          backgroundColor: "white",
          bottom: 6,
          left: 6,
          alignSelf: "flex-start",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          elevation: 3,
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          shadowColor: "#808080",
          shadowOffset: {
            width: 0,
            height: 4,
          },
        }}
      >
        <FontAwesome5 name="arrow-left" size={35} color="rgba(0,137,142,1)" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  blankrect: {
    height: 80,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  halfNotSelected: {
    height: 80,
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.48,
    borderRadius: 30,
    elevation: 0.5,
  },
  halfSelected: {
    height: 80,
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.48,
    borderRadius: 30,
    borderColor: "rgba(0,137,142,1)",
    borderWidth: 2,
  },
  scroll: {
    paddingRight: 12,
    paddingLeft: 12,
  },
  AzanTitle: {
    color: "rgba(156,152,152,100)",
    fontSize: 18,
  },

  slider: {
    height: 45,
  },
  TheBigTitle: {
    color: "rgba(156,152,152,100)",
    fontSize: 30,
    textAlign: "left",
    marginBottom: 20,
    paddingTop: 50,
    marginHorizontal: 12,
    paddingHorizontal: 9,
  },
  textCon: {
    width: 320,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallText: {
    color: "rgba(156,152,152,100)",
    fontSize: 14,
    flex: 1.4,
    textAlign: "center",
  },
});
