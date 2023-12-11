import * as React from "react";
import { View, StyleSheet, Image, Text, Pressable, Button } from "react-native";
import { Dimensions } from "react-native";
import { useAppContext } from "@components/AppContext";
import SelectDropdown from "react-native-select-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ExternalStorageDirectoryPath } from "react-native-fs";
import {
  DocumentFileDetail,
  listFiles,
  readFile,
  writeFile,
} from "react-native-saf-x";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import AOVZstd from "@modules/zstd";
import { dict } from "@constants/aov_dict";
import {
  initializeRewardedAds,
  showAds,
} from "@components/_applovin/RewardedAds";

type Props = {};

const parsePath = (path: string): string => {
  return (
    ExternalStorageDirectoryPath +
    "/" +
    path
      .replaceAll(
        "content://com.android.externalstorage.documents/document/primary%3A",
        "",
      )
      .replaceAll("%2F", "/")
  );
};
export default function AppSelectMethod(props: Props) {
  const { target, mode, setStep } = useAppContext();
  const progressBarRef = React.useRef<ProgressBar>(null);
  const [files, setFiles] = React.useState<DocumentFileDetail[]>([]);
  const [doing, setDoing] = React.useState(false);
  const [method, setMethod] = React.useState<"compress" | "decompress">(
    "compress",
  );
  const [progress, setProgress] = React.useState(0);

  initializeRewardedAds();

  React.useEffect(() => {
    listFiles(target)
      .then((files) => {
        setFiles(files);
      })
      .catch(() => {
        setFiles([]);
      });
  }, [target]);

  const handleCompress = React.useCallback(async () => {
    setMethod("compress");
    setDoing(true);
    let doneCount = 0;
    for await (const file of files) {
      const fileContent = await readFile(file.uri, {
        encoding: "base64",
      });
      try {
        const compressed = await AOVZstd.compressFromBase64String(
          fileContent,
          dict,
        );
        try {
          await writeFile(file.uri, compressed, {
            encoding: "base64",
          });
        } catch (e) {
          console.log("Write file error", e);
        }
        doneCount++;
        setProgress(doneCount / files.length);
      } catch (e) {
        console.log("Compress lib had error", e);
      }
    }
  }, [files]);

  const back = React.useCallback(() => {
    setDoing(false);
    setProgress(0);
    setStep(0);
  }, [setStep]);

  const handleDecompress = React.useCallback(async () => {
    setMethod("decompress");
    setDoing(true);
    let doneCount = 0;
    for await (const file of files) {
      const fileContent = await readFile(file.uri, {
        encoding: "base64",
      });
      try {
        const compressed = await AOVZstd.decompressFromBase64String(
          fileContent,
          dict,
        );
        try {
          await writeFile(file.uri, compressed, {
            encoding: "base64",
          });
        } catch (e) {
          console.log("Write file error", e);
        }
        doneCount++;
        setProgress(doneCount / files.length);
      } catch (e) {
        console.log("Decompress lib had error", e);
      }
    }
  }, [files]);

  React.useEffect(() => {
    if (progress === 1) {
      showAds().then();
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icons/files.png")}
        style={styles.img}
      />
      <Text style={styles.text}>
        {mode === "use-folder"
          ? `Đã chọn thư mục ${target.split("/").at(-1)} gồm ${
              files.length
            } tệp tin`
          : `Đã chọn ${target.length} tệp tin`}
      </Text>
      <View style={styles.drop}>
        {!doing && (
          <SelectDropdown
            statusBarTranslucent={true}
            selectedRowStyle={{
              backgroundColor: "#f1ecec",
            }}
            data={["Liên Quân Mobile"]}
            rowTextStyle={{
              color: "#000",
              fontSize: 16,
            }}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            dropdownStyle={{
              borderRadius: 10,
            }}
            search={true}
            defaultValueByIndex={0}
            defaultButtonText={"Chọn dictionary..."}
            selectedRowTextStyle={{
              color: "#000",
              fontSize: 16,
            }}
            buttonStyle={{ backgroundColor: "#F5F5F5", borderRadius: 10 }}
            buttonTextStyle={{ color: "#000" }}
          />
        )}
      </View>
      <View style={{ marginTop: 20 }} />
      {doing ? (
        <View style={styles.doing}>
          {progress != 1 ? (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                {method === "compress" ? "Đang nén..." : "Đang giải nén..."}
              </Text>
              <ProgressBar
                ref={progressBarRef}
                style={styles.progressbar}
                styleAttr="Horizontal"
                indeterminate={false}
                progress={progress}
                color={"#5382e7"}
              />
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                Đã xong!
              </Text>
              <Pressable onPress={back}>
                <Text
                  style={[
                    styles.label,
                    {
                      textAlign: "center",
                      color: "#fff",
                      fontSize: 16,
                      fontFamily: "Inter-Bold",
                      marginTop: 10,
                      borderRadius: 10,
                      backgroundColor: "#60b2e5",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    },
                  ]}
                >
                  Quay lại
                </Text>
              </Pressable>
            </>
          )}
        </View>
      ) : (
        <>
          <SelectBox onPress={handleCompress} color="#ea66f3" label="Nén tệp" />
          <SelectBox
            onPress={handleDecompress}
            color="#5382e7"
            label="Giải nén"
          />
        </>
      )}
    </View>
  );
}

interface SelectBoxProps {
  label: string;
  color: string;
  onPress?: () => void;
}
function SelectBox({ label, color, onPress }: SelectBoxProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selectbox,
        {
          borderColor: color,
        },
      ]}
    >
      {/*Compress icon*/}
      <Ionicons
        name="repeat"
        size={30}
        color={color}
        style={{ marginLeft: 10 }}
      />
      <Text
        style={[
          styles.box_label,
          {
            color: color,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selectbox: {
    width: "80%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#5382e7",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  doing: {
    width: "70%",
  },
  box_label: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    marginLeft: 10,
  },
  progressbar: {
    borderRadius: 10,
    overflow: "hidden",
  },
  container: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 100,
  },
  text: {
    color: "#000",
    fontSize: 17,
    fontFamily: "Inter-Bold",
    marginTop: 5,
    fontWeight: "700",
    marginBottom: 40,
  },
  drop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  label: { marginRight: 10, fontSize: 16 },
});
