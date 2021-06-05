import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { YourMasjidContext } from "./Provider";
const green = "rgba(0,137,142,1)";

import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Autolink from "react-native-autolink";
import Accordion from "react-native-collapsible/Accordion";
export default function posts({ navigation }) {
  const [ActiveSections, setActiveSections] = useState([]);
  const Ctxt = useContext(YourMasjidContext);

  const _renderHeader = (section) => {
    return (
      <View style={styles.TitleRect}>
        <Text style={styles.date}>{section.Date}</Text>
        <Text style={styles.Title}>{section.Title}</Text>
      </View>
    );
  };
  const _renderContent = (section) => {
    return (
      <View style={styles.oneRect}>
        <Autolink
          text={section.Body}
          style={styles.PostText}
          showAlert={true}
          textProps={{ editable: true }}
        ></Autolink>
      </View>
    );
  };
  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.TheBigTitle}>Announcements</Text>

      <ScrollView style={styles.scroll}>
        <Accordion
          sections={Ctxt.postList}
          activeSections={ActiveSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
          touchableComponent={TouchableOpacity}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
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
        <FontAwesome5 name="arrow-left" size={35} color="rgba(0,150,136,1)" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  scroll: {
    paddingTop: 10,
    paddingHorizontal: 12,
    marginBottom: 5,
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
  PostText: {
    color: "rgba(0,0,0,100)",
    fontSize: 18,
    textAlign: "left",
    paddingVertical: 5,
    paddingHorizontal: 4,
    flex: 1,
  },

  oneRect: {
    backgroundColor: "rgba(255,255,255,1)",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 3,
    marginRight: 3,
    elevation: 2,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor:green,
  },

  TitleRect: {
    backgroundColor: green,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 17,
    elevation: 6,
    shadowOpacity: 10,
    shadowColor: "grey",
  },
  Title: {
    paddingVertical: 5,
    fontSize: 23,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  date: {
    color: "white",
    paddingVertical: 5,
    fontSize: 18,
  },
});
