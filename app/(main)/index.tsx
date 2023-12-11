import * as React from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import DocumentPickStep from "@components/_steps/DocumentPickStep";
import AppContext, { useAppContext } from "@components/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppSelectMethod from "@components/_steps/AppSelectMethod";
import ApplovinProvider, {
  useApplovin,
} from "@components/_applovin/useApplovin";
import BannerAds from "@components/_applovin/BannerAds";
type Props = {};

export default function Index(props: Props) {
  return (
    <SafeAreaView>
      <ApplovinProvider>
        <AppContext>
          <AppBar />
          <Render />
          <Ads />
        </AppContext>
      </ApplovinProvider>
    </SafeAreaView>
  );
}

function Ads() {
  const { initialized } = useApplovin();
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
      }}
    >
      {initialized && <BannerAds />}
    </View>
  );
}

function Render() {
  const { step } = useAppContext();
  switch (step) {
    case 0:
      return <DocumentPickStep />;

    case 1:
      return <AppSelectMethod />;
  }
}

function AppBar() {
  const { step, setStep, animation: animatedValue } = useAppContext();
  const handleBack = React.useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setStep(0);
  }, [setStep]);

  React.useEffect(() => {
    if (step === 0) return;
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [step, animatedValue]);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View>
      <Pressable onPress={handleBack}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: animatedValue,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={30} color="black" />
          <Text style={styles.backtext}>Quay lại</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 2,
    paddingHorizontal: 10,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  backtext: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    marginLeft: 10,
    fontWeight: "600",
  },
});
