import React from "react";
import { AppLovinMAX, Configuration } from "react-native-applovin-max/src";

type ApplovinContext = {
  initialized: boolean;
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
};
const context = React.createContext<ApplovinContext>({
  initialized: false,
  setInitialized: () => {},
});

export default function ApplovinProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = React.useState(false);
  return (
    <context.Provider value={{ initialized, setInitialized }}>
      {children}
    </context.Provider>
  );
}
export function useApplovin() {
  const { setInitialized } = React.useContext(context);
  AppLovinMAX.initialize(
    "BPgoeekH1EBg4KpLShNbews_rEWK__A8ehsQDHt5lgPX63IrvonWds06_gVESdIJS4AsrLhqkcBPilLFNsJ76q",
  )
    .then((conf: Configuration) => {
      setInitialized(true);
    })
    .catch((error) => {
      setInitialized(false);
      console.log(
        "AppLovin MAX SDK failed to initialize with error code: " + error.code,
      );
    });
  return React.useContext(context);
}
