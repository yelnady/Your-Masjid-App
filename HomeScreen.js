import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import Autolink from "react-native-autolink";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  AzanTimes365,
  getIqamaWeek,
  getNextPrayer,
  getGDate,
  getHDate,
} from "./Database/AzanTimes";
import notifyApp from "./notifiyApp";
import moment from "moment";
const green = "rgba(0,137,142,1)";
import { YourMasjidContext } from "./Provider";

export default function home({ navigation }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currDate, setCurrDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(moment().add(364, "days").toDate());
  const [AzanTimes, setAzanTimes] = useState(AzanTimes365);
  const [flatListRef, setFlatListRef] = useState();
  const [NextPrayerTime, setNextPrayerTime] = useState(getNextPrayer());
  const Ctxt = useContext(YourMasjidContext);
  notifyApp(navigation);

  /********************************************************************************/
  useEffect(() => {
    setNextPrayerTime(getNextPrayer());
    setAzanTimes(AzanTimes365);
    setMaxDate(moment().add(364, "days").toDate());
  }, []);

  /********************************************************************************/
  //When Click OK on the Date Picker what to do
  const handleConfirm = (selectedDate) => {
    setDatePickerVisibility(Platform.OS === "ios");
    var now = moment().dayOfYear();
    var future = moment(selectedDate).dayOfYear();
    //Calculate the Index of the page in the flatlist
    var isCurrentLeap = moment().year() % 4 == 0;
    var yearDays = isCurrentLeap == true ? 366 : 365;
    flatListRef.scrollToIndex({
      animated: true,
      //if future is less than now, it means it is a new year, so add all days till end of the years plus the new days
      index:
        now < future
          ? future - now
          : now == future
          ? 0
          : yearDays - now + future,
    });
    setCurrDate(selectedDate); // of the picker date
    setDatePickerVisibility(false);
  };
  /********************************************************************************/
  let [fontsLoaded] = useFonts({
    recursive: require("./assets/fonts/Recursive.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  /********************************************************************************/

  function OneRect(props) {
    return (
      <View style={styles.OnePrayerRect}>
        <Text style={styles.fajr}>{props.title}</Text>
        <Text style={props.boldd ? styles.timePrayerBold : styles.timePrayer}>
          {props.azan}
        </Text>
        <Text style={props.boldd ? styles.timePrayerBold : styles.timePrayer}>
          {props.iqama}
        </Text>
      </View>
    );
  }
  /********************************************************************************/
  const RenderItem = ({ item, index }) => {
    // item is the azan times, and item[6] especially contains the "date" of this row/prayer times
    let currDate = item[6].clone();
    const gdate = getGDate(currDate);
    //Here we try to correct the hijri date by accessing it from the asyncStorage
    const hdate = getHDate(currDate.add(Ctxt.HijriCorrect, "days"));
    //gets the iqama times based on the currDate
    const IqamaTimesOneDay = getIqamaWeek(currDate);
    return (
      <View key={gdate} style={{ width: Dimensions.get("window").width }}>
        <View>
          <Text style={styles.GDateStyle}>{gdate}</Text>
          <Text style={styles.HDateStyle}>{hdate}</Text>
        </View>
        <View style={styles.AllPrayersGroup}>
          <View style={styles.blankk}>
            <Text style={styles.fajr}>{""}</Text>
            <Text style={styles.AzanTitle}>Azan</Text>
            <Text style={styles.AzanTitle}>Iqama</Text>
          </View>
          <OneRect
            title="Fajr"
            azan={item[0]}
            iqama={IqamaTimesOneDay[0]}
            boldd={NextPrayerTime == 1 && index == 0 ? true : false}
          />
          <OneRect
            title="Sunrise"
            azan={item[1]}
            iqama={""}
            boldd={NextPrayerTime == 2 && index == 0 ? true : false}
          />
          <OneRect
            //item[5] contains current day, if it's Friday, make Jumaa, and always prayer at 1:30
            //If item[5].weekday() == 0, then it's sunday and current iqama is at 1:35 PM
            title={currDate.weekday() == 5 ? "Jumaa" : "Duhr"}
            azan={item[2]}
            iqama={
              currDate.weekday() == 5
                ? "1:30 PM"
                : currDate.weekday() == 0
                ? "1:35 PM"
                : IqamaTimesOneDay[1]
            }
            boldd={NextPrayerTime == 3 && index == 0 ? true : false}
          />
          <OneRect
            title="Asr"
            azan={item[3]}
            iqama={IqamaTimesOneDay[2]}
            boldd={NextPrayerTime == 4 && index == 0 ? true : false}
          />
          <OneRect
            title="Maghrib"
            azan={item[4]}
            iqama={IqamaTimesOneDay[3]}
            boldd={NextPrayerTime == 5 && index == 0 ? true : false}
          />
          <OneRect
            title="Ishaa"
            azan={item[5]}
            iqama={IqamaTimesOneDay[4]}
            boldd={NextPrayerTime == 6 && index == 0 ? true : false}
          />
        </View>
      </View>
    );
  };
  /********************************************************************************/

  return (
    <View style={styles.container}>
      {/* The Top Bar*/}
      <View style={styles.TopRect}>
         
        <Text style={styles.PrayerTimes}>Prayer Times</Text>
        <TouchableOpacity
          onPress={() => setDatePickerVisibility(true)}
          activeOpacity={0.1}
          pressDuration={0}
        >
          <FontAwesome name="calendar-o" style={styles.icon} />
        </TouchableOpacity>
        <DateTimePickerModal
          isDarkModeEnabled={false}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          date={currDate}
          minimumDate={new Date()}
          maximumDate={maxDate}
          confirmTextIOS="OK"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
        />
      </View>
      {/* Here is the prayers list, using the RenderItem */}
      <ScrollView>
        <FlatList
          data={AzanTimes}
          ref={(ref) => {
            setFlatListRef(ref);
          }}
          renderItem={RenderItem}
          // Any Key to be returned, just word "key" and the index
          keyExtractor={(item, index) => "key" + index}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          extraData={AzanTimes}
          pagingEnabled={true}
          getItemLayout={(data, index) => ({
            index,
            length: Dimensions.get("window").width,
            offset: Dimensions.get("window").width * index,
          })}
        />

        {/* Here is the bottom Views to show the recent posts */}
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          style={{ paddingTop: 24 }}
        >
          <TouchableOpacity
            style={styles.TitleRect}
            showsHorizontalScrollIndicator={true}
            onPress={() => navigation.navigate("Posts")}
          >
            <Autolink
              style={styles.Title}
              text={Ctxt.StablePost}
              linkStyle={{ fontWeight: "bold" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.TitleRect}
            onPress={() => navigation.navigate("Posts")}
          >
            <Text style={styles.date}>
              {Ctxt.LastPost != null ? Ctxt.LastPost.Date : ""}
            </Text>
            <Text style={styles.LastTitle}>
              {Ctxt.LastPost != null ? Ctxt.LastPost.Title : "Loading..."}
            </Text>
          </TouchableOpacity>
        </ScrollView>
         
      </ScrollView>

      {/* Here is the bottom navigation bar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Posts")}
        activeOpacity={0.5}
        accessibilityHint="settings"
        style={{
          borderRadius: 50,
          width: 65,
          height: 65,
          backgroundColor: "white",
          bottom: 6,
          right: 6,
          alignSelf: "flex-end",
          marginTop: 2,
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
        <Ionicons
          name="md-notifications-outline"
          style={{
            ...(Platform.OS === "ios"
              ? {
                  paddingTop: 4,
                }
              : {}),
          }}
          size={40}
          color={green}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
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
        <MaterialIcons
          name="settings"
          size={40}
          color={green}
          style={{
            ...(Platform.OS === "ios"
              ? {
                  paddingTop: 4,
                }
              : {}),
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
/********************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TopRect: {
    backgroundColor: green,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  PrayerTimes: {
    color: "rgba(255,255,255,1)",
    marginTop: 50,
    fontSize: 27,
    fontFamily: "recursive",
    alignSelf: "center",
    marginLeft: 12,
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 30,
    marginTop: 55,
    marginRight: 12,
  },
  AllPrayersGroup: {
    justifyContent: "space-between",
    alignItems: "stretch",
    flexDirection: "column",
    marginBottom: 2,
    flex: 1,
  },

  OnePrayerRect: {
    height: 45,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginLeft: 20,
    marginRight: 20,
    elevation: 1,
  },

  TitleRect: {
    backgroundColor: green,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowOpacity: 10,
    shadowColor: "grey",
    marginBottom: 30,
    marginTop: 15,
    width: Dimensions.get("window").width,
  },
  blankk: {
    height: 30,
    backgroundColor: "transparent",
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 14,
    marginLeft: 20,
    marginRight: 20,
  },
  fajr: {
    marginLeft: 15,
    color: "rgba(156,152,152,100)",
    fontSize: 22,
    flex: 1.4,
  },

  timePrayer: {
    color: "#121212",
    fontSize: 20,
    alignItems: "center",
    flex: 1,
  },
  timePrayerBold: {
    color: "#121212",
    fontSize: 20,
    alignItems: "center",
    flex: 1,
    fontWeight: "bold",
  },
  AzanTitle: {
    color: "rgba(156,152,152,100)",
    fontSize: 22,
    alignItems: "center",
    flex: 1,
  },
  HDateStyle: {
    color: "#121212",
    fontSize: 33,
    textAlign: "center",
    marginTop: 10,
  },
  GDateStyle: {
    color: "#121212",
    fontSize: 15,
    marginTop: 4,
    textAlign: "center",
    fontFamily: "recursive",
  },
  Title: {
    paddingVertical: 5,
    fontSize: 21,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    paddingHorizontal: 7,
  },
  LastTitle: {
    paddingVertical: 5,
    fontSize: 21,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    paddingHorizontal: 7,
  },
  date: {
    color: "white",
    paddingVertical: 5,
    fontSize: 18,
    alignSelf: "center",
  },
});
