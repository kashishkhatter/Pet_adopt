import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo"; //for authentication
import * as SecureStore from "expo-secure-store"; //to keep user logged in

//contains layout to be followed across all screens of app

const tokenCache = {
  async getToken(key) {
    //code to be copied from clerk doc
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useFonts({
    //fonts to be applied throughout
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });
  return (
    //wrap app in clerk to apply authentication
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        {/*stack navigator for pushing popping diff screens of app(List of all screens)*/}
        <Stack.Screen name="index" /> {/*main/first screen of app*/}
        <Stack.Screen
          name="(tabs)"
          options={{
            //dont display header for login screeen
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login/index"
          options={{
            //dont display header for login screeen
            headerShown: false,
          }}
        />
      </Stack>
    </ClerkProvider>
  );
}
