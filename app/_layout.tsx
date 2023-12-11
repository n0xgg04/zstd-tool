import * as React from "react";
import { PermissionsAndroid } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

type Props = {};

const checkPermission = async () => {
  const checkRead = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  const checkWrite = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  return checkRead && checkWrite;
};

const requestPermission = async () => {
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ]);
  return (
    result["android.permission.READ_EXTERNAL_STORAGE"] === "granted" &&
    result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted"
  );
};

export default function Layout(props: Props) {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  React.useEffect(() => {
    checkPermission().then((granted) => {
      console.log("granted", granted);
      if (!granted) {
        requestPermission().then((r) => console.log("r", r));
      }
    });
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(main)"
    />
  );
}
