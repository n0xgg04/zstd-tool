import * as React from "react";
import { Text, View } from "react-native";
import BannerAds from "@components/_applovin/BannerAds";
import ApplovinProvider, {
  useApplovin,
} from "@components/_applovin/useApplovin";

type Props = {};
export default function Page(props: Props) {
  return (
    <ApplovinProvider>
      <Content />
    </ApplovinProvider>
  );
}

function Content() {
  const { initialized } = useApplovin();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "normal",
          fontFamily: "Inter-Regular",
        }}
      >
        Chưa cho phép thêm từ điển mới
      </Text>
      {initialized && <BannerAds />}
    </View>
  );
}
