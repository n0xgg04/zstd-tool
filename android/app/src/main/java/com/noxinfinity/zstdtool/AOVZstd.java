package com.noxinfinity.zstdtool;


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.github.luben.zstd.ZstdInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import  java.io.File;
import android.util.Base64;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import com.github.luben.zstd.ZstdOutputStream;

public class AOVZstd extends ReactContextBaseJavaModule {
    AOVZstd(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AOVZstd";
    }

    @ReactMethod
    public void getZstdVersion(Promise promise) {
        promise.resolve("1.4.5");
    }

    @ReactMethod
    public void Base64ToUtf8(String base64String, Promise promise) {
        byte[] inputData = Base64.decode(base64String, Base64.DEFAULT);
        String outputString = new String(inputData);
        promise.resolve(outputString);
    }

    @ReactMethod
    public void Utf8ToBase64(String inputString, Promise promise) {
        byte[] inputData = inputString.getBytes();
        String outputBase64String = Base64.encodeToString(inputData, Base64.DEFAULT);
        promise.resolve(outputBase64String);
    }

    @ReactMethod
    public void decompressFromBase64String(String base64String,String dictBase64String, Promise promise) {
        byte[] inputData = Base64.decode(base64String, Base64.DEFAULT);
        String outputBase64String = null;

        try (ByteArrayInputStream input = new ByteArrayInputStream(inputData);
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            input.skip(8);
            byte[] dictionary = Base64.decode(dictBase64String, Base64.DEFAULT);
            try (ZstdInputStream decompressedInput = new ZstdInputStream(input)) {
                decompressedInput.setDict(dictionary);
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = decompressedInput.read(buffer)) > 0) {
                    output.write(buffer, 0, bytesRead);
                }
            }
            byte[] outputData = output.toByteArray();
            outputBase64String = Base64.encodeToString(outputData, Base64.DEFAULT);
            promise.resolve(outputBase64String);
        } catch (IOException e) {
            promise.reject("Error during decompression: " + e.getMessage());
        }
    }

   @ReactMethod
   public void compressFromBase64String(String base64String, String dictBase64String, Promise promise) {
       byte[] inputData = Base64.decode(base64String, Base64.DEFAULT);
       String outputBase64String;

       try (ByteArrayInputStream input = new ByteArrayInputStream(inputData);
            ByteArrayOutputStream compressedOutput = new ByteArrayOutputStream();
            ZstdOutputStream zstdOutputStream = new ZstdOutputStream(compressedOutput, 2)) {

           // Load the dictionary
           byte[] dictionary = Base64.decode(dictBase64String, Base64.DEFAULT);
           zstdOutputStream.setDict(dictionary);

           // Compress the input data and write it to the output stream
           byte[] buffer = new byte[4096];
           int bytesRead;
           while ((bytesRead = input.read(buffer)) > 0) {
               zstdOutputStream.write(buffer, 0, bytesRead);
           }

           zstdOutputStream.flush(); // Flush any remaining compressed data
           zstdOutputStream.close();
           byte[] compressedData = compressedOutput.toByteArray();

           // Create a new output stream for the final result
           ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

           // Convert the length of the input data to 4-byte little-endian format
           byte[] dataSizeBytes = ByteBuffer.allocate(4)
                   .order(ByteOrder.LITTLE_ENDIAN)
                   .putInt(inputData.length)
                   .array();

           // Write the header to the output stream
           outputStream.write(new byte[]{0x22, 0x4a, 0x00, (byte) 0xef});
           outputStream.write(dataSizeBytes);

           // Write the compressed data to the output stream
           outputStream.write(compressedData);

           // Convert the output stream to byte array and encode to Base64
           byte[] outputData = outputStream.toByteArray();
           outputBase64String = Base64.encodeToString(outputData, Base64.DEFAULT);

           promise.resolve(outputBase64String);
       } catch (IOException e) {
           promise.reject("Error during compression: " + e.getMessage());
       }
   }
}
