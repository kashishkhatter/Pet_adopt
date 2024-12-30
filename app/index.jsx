import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View } from "react-native";

// First screen of app
export default function Index() {
  const { user, isLoaded } = useUser(); // useUser hook of Clerk gets all info of logged-in user

  if (!isLoaded) {
    // Optionally, you can return a loading state while Clerk is checking the user's session
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {user ? (
        // If user is logged in, navigate directly to home screen from tabs
        <Redirect href={"/(tabs)/home"} />
      ) : (
        // If not logged in, take them to the login screen
        <Redirect href={"/login"} />
      )}
    </View>
  );
}
