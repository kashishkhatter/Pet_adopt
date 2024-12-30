import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function OwnerInfo({ pet }) {
  //pet info from parent
  return (
    <View
      style={{
        paddingHorizontal: 20,
        marginHorizontal: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        backgroundColor: Colors.WHITE,
        justifyContent: "space-between",
        borderColor: Colors.PRIMARY,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 20,
        }}
      >
        <Image
          source={{ uri: pet?.userImage }} //owner image
          style={{
            width: 50,
            height: 50,
            borderRadius: 99,
          }}
        />
        <View>
          <Text //owner name
            style={{
              fontFamily: "outfit-medium",
              fontSize: 17,
            }}
          >
            {pet?.userName}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              color: Colors.GRAY,
            }}
          >
            Pet Owner
          </Text>
        </View>
      </View>
      <FontAwesome name="send" size={24} color={Colors.PRIMARY} />
    </View>
  );
}
