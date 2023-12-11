import { NativeModules } from "react-native";
const { AOVZstd } = NativeModules;
interface AOVZstdInterface {
  getZstdVersion(): Promise<string>;
  decompressFromBase64String(
    base64String: string,
    dictBase64String: string,
  ): Promise<string>;
  Base64ToUtf8(base64String: string): Promise<string>;
  Utf8ToBase64(utf8String: string): Promise<string>;
  compressFromBase64String(
    base64String: string,
    dictBase64String: string,
  ): Promise<string>;
}
export default AOVZstd as AOVZstdInterface;
