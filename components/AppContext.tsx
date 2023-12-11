import * as React from "react";
import { Animated } from "react-native";

type ContextType = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  mode: "use-file" | "use-folder";
  setMode: React.Dispatch<React.SetStateAction<"use-file" | "use-folder">>;
  target: any;
  setTarget: React.Dispatch<React.SetStateAction<any>>;
  animation: Animated.Value;
};
const NoxContext = React.createContext<ContextType>({
  step: 0,
  setStep: () => {},
  mode: "use-file",
  setMode: () => {},
  target: null,
  setTarget: () => {},
  animation: new Animated.Value(1),
});

export default function AppContext<T>({
  children,
}: {
  children: React.ReactNode;
}) {
  const [step, setStep] = React.useState<number>(0);
  const [mode, setMode] = React.useState<"use-file" | "use-folder">("use-file");
  const [target, setTarget] = React.useState<T>(null as T);
  const animated = React.useRef(new Animated.Value(1)).current;
  return (
    <NoxContext.Provider
      value={{
        step,
        setStep,
        mode,
        setMode,
        target,
        setTarget,
        animation: animated,
      }}
    >
      {children}
    </NoxContext.Provider>
  );
}

export function useAppContext() {
  return React.useContext(NoxContext);
}
