import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback } from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

//login screen
// Ensure OAuth flow completes properly
WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const LoginScreen = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { session, signOut, setSession } = useAuth(); // using setSession instead of signIn

  const onPress = useCallback(async () => {
    try {
      // If there's an existing session, sign out to clear it
      if (session) {
        console.log("Existing session found. Signing out...");
        await signOut(); // Sign out to start fresh
      }

      console.log("Starting OAuth flow...");
      // Start the OAuth flow
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        console.log("Session created successfully:", createdSessionId);
        // Set the created session as active using setSession
        await setSession({ sessionId: createdSessionId });
        console.log("Session set successfully");
      } else {
        console.error("No session created during OAuth flow");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow, session, signOut, setSession]);

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Image
        source={require("./../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: 500,
          marginTop: -50,
        }}
      />
      <View
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Ready to make a new friend?
        </Text>

        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
            marginTop: 10,
          }}
        >
          Make a lifelong connection with a pet waiting to be loved.
        </Text>

        <Pressable
          onPress={onPress}
          style={{
            padding: 14,
            marginTop: 30,
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
