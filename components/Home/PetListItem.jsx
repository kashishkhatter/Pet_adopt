import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../MarkFav";

//to render items within a pet category
export default function PetListItem({ pet }) {
  //pet para to be passed to petlistbycategory component

  const router = useRouter(); //to navigate between pages
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          //on selecting pet go to pet-details also pass that pet's details through pet param
          pathname: "pet-details",
          params: pet,
        })
      }
      style={{
        padding: 10,
        marginRight: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginBottom: 5,
        position: "relative",
      }}
    >
      <View //fav option
        style={{
          position: "absolute",
          zIndex: 10,
          right: 10,
          top: 10,
        }}
      >
        <MarkFav pet={pet} color={"white"} />
      </View>

      <Image
        source={{ uri: pet?.image_url }} //get images from list
        style={{
          width: 150,
          height: 120,
          objectFit: "cover",
          borderRadius: 10,
        }}
      />
      <Text //pet name
        style={{
          fontFamily: "outfit-medium",
          fontSize: 18,
        }}
      >
        {pet?.name}
      </Text>

      <View //breed
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Colors.GRAY,
            fontFamily: "outfit",
          }}
        >
          {pet?.breed}
        </Text>

        <Text //age
          style={{
            color: Colors.PRIMARY,
            backgroundColor: Colors.LIGHT_PRIMARY,
            fontFamily: "outfit",
            borderRadius: 10,
            paddingHorizontal: 7,
            fontSize: 11,
          }}
        >
          {pet.age}YRS
        </Text>
      </View>
    </TouchableOpacity>
  );
}
