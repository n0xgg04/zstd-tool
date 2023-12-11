import { RewardedAd } from "react-native-applovin-max";
import { useRef } from "react";
import {
  AdDisplayFailedInfo,
  AdInfo,
  AdLoadFailedInfo,
  AdRewardInfo,
} from "react-native-applovin-max/src";

const REWARDED_AD_UNIT_ID = "c2089e6f677bdab0";

const retryAttempt = useRef(0);

export const initializeRewardedAds = () => {
  RewardedAd.addAdLoadedEventListener((adInfo: AdInfo) => {
    // Rewarded ad is ready to show. AppLovinMAX.isInterstitialReady(REWARDED_AD_UNIT_ID) now returns 'true'

    // Reset retry attempt
    retryAttempt.current = 0;
  });
  RewardedAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
    // Rewarded ad failed to load
    // AppLovin recommends that you retry with exponentially higher delays up to a maximum delay (in this case 64 seconds)

    retryAttempt.current += 1;

    const retryDelay = Math.pow(2, Math.min(6, retryAttempt.current));

    console.log("Rewarded ad failed to load - retrying in " + retryDelay + "s");

    setTimeout(() => {
      loadRewardedAd();
    }, retryDelay * 1000);
  });
  RewardedAd.addAdClickedEventListener((adInfo: AdInfo) => {});
  RewardedAd.addAdDisplayedEventListener((adInfo: AdInfo) => {});
  RewardedAd.addAdFailedToDisplayEventListener(
    (adInfo: AdDisplayFailedInfo) => {
      // Rewarded ad failed to display. AppLovin recommends that you load the next ad
      loadRewardedAd();
    },
  );
  RewardedAd.addAdHiddenEventListener((adInfo: AdInfo) => {
    loadRewardedAd();
  });
  RewardedAd.addAdReceivedRewardEventListener((adInfo: AdRewardInfo) => {
    // Rewarded ad displayed and user should receive the reward
  });

  // Load the first rewarded ad
  loadRewardedAd();
};

export const loadRewardedAd = () => {
  RewardedAd.loadAd(REWARDED_AD_UNIT_ID);
};

export async function showAds() {
  const isRewardedAdReady = await RewardedAd.isAdReady(REWARDED_AD_UNIT_ID);
  if (isRewardedAdReady) {
    RewardedAd.showAd(REWARDED_AD_UNIT_ID);
  }
}
