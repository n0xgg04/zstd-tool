import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageProps,
  Pressable,
  Text,
  Animated,
  PermissionsAndroid,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { Dimensions } from "react-native";
import { useAssets } from "expo-asset";
import { useAppContext } from "@components/AppContext";
import { openDocumentTree, mkdir, listFiles } from "react-native-saf-x";

type Props = {};

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

export default React.memo(function DocumentPickStep(props: Props) {
  const { setMode, setTarget, target, setStep, animation } = useAppContext();
  const [assets] = useAssets([require("../../assets/images/icon.png")]);

  const handleAppBar = React.useCallback(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: 1,
    });
  }, [animation]);

  const handleOnOpenDocument = React.useCallback(async () => {
    requestPermission().then((r) => console.log("DC", r));
    const doc = await openDocumentTree(true);
    if (doc && doc.uri) {
      setMode("use-folder");
      setTarget(doc.uri);
      setStep(1);
    }
  }, [setTarget]);

  return (
    <View style={styles.container}>
      {assets != undefined && (
        <Image
          style={styles.imageLogo}
          source={assets[0] as unknown as ImageProps}
        />
      )}
      <Pressable onPress={handleOnOpenDocument} style={styles.buttons}>
        <Text style={styles.btnText}>Chọn thư mục</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    boxShadow: "border-box",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Dimensions.get("window").height * 0.2,
  },
  buttons: {
    borderStyle: "solid",
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttons2: {
    borderStyle: "solid",
    borderWidth: 2,
    boxSizing: "border-box",
    borderColor: "#000",
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontWeight: "700",
  },
  btnText2: {
    color: "black",
    fontFamily: "Inter-Regular",
    fontWeight: "700",
  },
  imageLogo: {
    height: 120,
    width: 120,
  },
});
