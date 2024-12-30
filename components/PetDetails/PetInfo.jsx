import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import MarkFav from "../MarkFav";

//selected pet image name and location on top
export default function PetInfo({ pet }) {
  return (
    <View>
      {/* Pet Image */}
      <Image
        source={{ uri: pet.image_url }} // Selected pet image
        style={{
          width: "100%",
          height: 380,
          resizeMode: "cover",
          marginBottom: 10,
        }}
      />

      {/* Pet Info Section */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Pet Details */}
        <View
          style={{
            flex: 1, // Allow this section to take as much space as needed
            marginRight: 10,
          }}
        >
          <Text //pet name
            style={{
              fontFamily: "outfit-bold",
              fontSize: 27,
            }}
          >
            {pet?.name}
          </Text>

          <Text //pet address
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.GRAY,
            }}
          >
            {pet?.address}
          </Text>
        </View>
        <MarkFav pet={pet} />
      </View>
    </View>
  );
}
