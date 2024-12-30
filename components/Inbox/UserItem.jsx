import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

export default function UserItem({ userInfo }) {
  return (
    <Link href={"/chat?id=" + userInfo.docId}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 15,
        }}
      >
        <Image
          source={{ uri: userInfo?.image_url }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 20,
          }}
        />
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 20,
            color: Colors.BLACK,
            flex: 1,
          }}
        >
          {userInfo?.name}
        </Text>
      </View>

      {/* Simple Divider Line */}
      <View
        style={{
          borderBottomWidth: 1, // Thicker divider
          borderBottomColor: Colors.GRAY, // Divider color
          width: "100%", // Ensure the divider stretches across the container
          marginVertical: 10, // More vertical space before and after divider
        }}
      />
    </Link>
  );
}
