import Constants from "expo-constants";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform, Linking } from "react-native";
import { db, firebaseAuth } from "./important/config";
import * as Device from "expo-device";
import { useNavigation } from "@react-navigation/native";

//This handler determines how your app handles notifications that come in while the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function notifiyApp(navigation) {
  const [USER, setUSER] = useState(-1);
  useEffect(() => {
    if (USER == -1) {
      //Trying to get the token of the firebase to register in the app.
      firebaseAuth.onAuthStateChanged((user) => {
        try {
          registerForPushNotificationsAsync(user.uid);
          setUSER(user);
        } catch (error) {
          //    console.log("m3l4");
        }
      });
    }
    //
    // adds a listener called whenever a new notification is received (ONLY WHEN APP IS FOREGROUND)
    //Listeners registered by this method will be called whenever a notification is received while the app is running.
    //Argument: a single and required argument is a "function" accepting a (Notification) as an argument.
    //Return  : a subscription object representing the subscription of the provided listener.
    // We use the returned subscription in return of useEffect to remove "subscription.remove();"
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    //Listeners registered by this method will be called whenever a user interacts with a notification
    //Argument: a single and required argument is a function accepting (NotificationResponse) as an argument.
    //Return  : a subscription object representing the subscription of the provided listener.
    // We use the returned subscription in return of useEffect to remove "subscription.remove();"
    const subscriptionInteract = Notifications.addNotificationResponseReceivedListener(
      (NotificationResponse) => {
        navigation.navigate("Posts");
      }
    );

    //Cleanup function
    return () => {
      //we can rather use  Notifications.removeNotificationSubscription(subscription // subscriptionInteract );
      //removeAllNotificationListeners() -> Removes all subscriptions that have been registered with addNotification*Listener.
      subscription.remove();
      subscriptionInteract.remove();
    };
  }, []);
}

async function registerForPushNotificationsAsync(userr) {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //ON IOS NOT ALLOWED TO SEND NOTIFICATIONS
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    //Returns an Expo token that can be used to send a push notification to this device using Expo push notifications service.
    //Returns data (string) -- The push token as a string
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  //SAVE TOKENS OF MY APP IN REALTIME DATABASE
  //console.log("Token is saved" + token);
  db.ref("USERS/" + userr).set({
    token: token,
    name:
      Device.deviceName +
      " - " +
      Device.brand +
      " - " +
      Device.osName +
      " - " +
      Device.osVersion,
  });

  // STYLING NOTIFICATION TYPE FOR ANDROID
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      //Click on any of them to show the other options to be set
      name: "default",
      enableLights: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "One Drop",
      lockscreenVisibility: true,
      lightColor: "#009688",
    });
  }
}
