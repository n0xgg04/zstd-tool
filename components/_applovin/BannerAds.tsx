import { BannerAd, AdViewPosition } from "react-native-applovin-max";
import { AdFormat, AdView } from "react-native-applovin-max/src";
import React, { useImperativeHandle } from "react";

const BANNER_AD_UNIT_ID = "ea235c240c79a51a";

function initializeBannerAds() {
  BannerAd.createAd(BANNER_AD_UNIT_ID!, AdViewPosition.BOTTOM_CENTER);
  BannerAd.setBackgroundColor(BANNER_AD_UNIT_ID!, "#000000");
}

const BannerAds = React.forwardRef((props, ref) => {
  React.useLayoutEffect(() => {
    initializeBannerAds();
    BannerAd.startAutoRefresh(BANNER_AD_UNIT_ID);
  }, []);

  useImperativeHandle(ref, () => ({
    show: () => {
      BannerAd.showAd(BANNER_AD_UNIT_ID);
    },
  }));

  return (
    <AdView
      adUnitId={BANNER_AD_UNIT_ID}
      adFormat={AdFormat.BANNER}
      adaptiveBannerEnabled={false}
    />
  );
});

export default BannerAds;
