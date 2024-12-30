import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../../components/Home/header";
import Slider from "../../components/Home/slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

// Home screen
export default function Home() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header */}

      <Header />

      {/* Slider */}

      <Slider />

      {/* PetListByCategory */}

      <PetListByCategory />

      {/* Add New Pet Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-new-pet")} //when add new pet clicked navigate to this folder
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          padding: 15,
          backgroundColor: Colors.LIGHT_PRIMARY,
          borderColor: Colors.PRIMARY,
          borderWidth: 1,
          borderRadius: 10,
          borderStyle: "dashed",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <FontAwesome name="paw" size={24} color={Colors.PRIMARY} />
        <Text
          style={{
            fontFamily: "outfit-medium",
            color: Colors.PRIMARY,
            fontSize: 18,
          }}
        >
          Add New Pet
        </Text>
      </TouchableOpacity>
    </View>
  );
}
