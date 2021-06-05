import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import home from "./HomeScreen";
import settings from "./SettingsScreen";
import * as ScreenOrientation from "expo-screen-orientation";
import posts from "./PostsScreen";
import { YourMasjidProvider } from "./Provider";

const Stack = createStackNavigator();
async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
}
export default function App() {
  changeScreenOrientation();
  return (
    <YourMasjidProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={home} />
          <Stack.Screen name="Settings" component={settings} />
          <Stack.Screen name="Posts" component={posts} />
        </Stack.Navigator>
      </NavigationContainer>
    </YourMasjidProvider>
  );
}
