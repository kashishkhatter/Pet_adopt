import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

const Header = () => {
  const { user } = useUser(); //get logged in user details from clerk
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
          }}
        >
          Welcome,
        </Text>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 25,
            marginBottom: 10,
          }}
        >
          {user?.fullName} {/*display username of logged in user*/}
        </Text>
      </View>
      <Image
        source={{ uri: user?.imageUrl }} //display profile pic of logged in user
        style={{
          width: 40,
          height: 40,
          borderRadius: 99,
        }}
      />
    </View>
  );
};

export default Header;
