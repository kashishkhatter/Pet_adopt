import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import PetSubInfoCard from "./PetSubInfoCard";

//other info of selected pet like sex,age etc
export default function PetSubInfo({ pet }) {
  //get all oet info inside pet para
  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <View //first row with two cards
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/*reusable card with variable para(icon,title,value*/}

        <PetSubInfoCard //for first card pass its icon,title,value
          icon={require("./../../assets/images/calendar.png")}
          title={"Age"}
          value={pet?.age + "YRS"}
        />
        <PetSubInfoCard //second card
          icon={require("./../../assets/images/bone.png")}
          title={"Breed"}
          value={pet?.breed}
        />
      </View>

      <View //second row with next two cards
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PetSubInfoCard //third card
          icon={require("./../../assets/images/sex.png")}
          title={"Sex"}
          value={pet?.sex}
        />
        <PetSubInfoCard //forth card
          icon={require("./../../assets/images/weight.png")}
          title={"Weight"}
          value={pet?.weight + "Kg"}
        />
      </View>
    </View>
  );
}
