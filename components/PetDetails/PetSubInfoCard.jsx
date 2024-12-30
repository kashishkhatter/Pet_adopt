import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function PetSubInfoCard({ icon, title, value }) {
  //icon,card title and value will be diff for each card so pass as para to make it variable

  //info cards-age,sex etc (repeated again and again so create one component)
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
        padding: 10,
        margin: 4,
        borderRadius: 8,
        gap: 10,
        flex: 1,
      }}
    >
      <Image
        source={icon} //card icon
        style={{
          width: 40,
          height: 40,
        }}
      />

      <View
        style={{
          flex: 1,
        }}
      >
        <Text //card title
          style={{
            fontFamily: "outfit",
            fontSize: 16,
            color: Colors.GRAY,
          }}
        >
          {title}
        </Text>
        <Text //card value(age,sex etc)
          style={{
            fontFamily: "outfit-medium",
            fontSize: 20,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
