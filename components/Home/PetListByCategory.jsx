import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./PetListItem";
import Colors from "../../constants/Colors";
//contains list of pets within each category
export default function PetListByCategory() {
  const [petList, setPetList] = useState([]); // State to store the list of pets fetched from Firestore
  const [loader, setLoader] = useState(false); //loading state
  useEffect(() => {
    GetPetList("Dogs");
  }, []);
  // Function to get the pet list based on the selected category
  const GetPetList = async (category) => {
    setLoader(true); //start loading
    setPetList([]);
    //'category' received from category component to know the selected category
    const q = query(collection(db, "Pets"), where("category", "==", category)); // Create a Firestore query to fetch pets where the 'category' field matches the selected category
    const querySnapshot = await getDocs(q); // Execute the query and get the documents

    querySnapshot.forEach((doc) => {
      // Iterate over each document in the query snapshot
      setPetList((petList) => [...petList, doc.data()]); // Update the petList state by appending the pet data to the existing list
    });
    setLoader(false); //hogya load
  };
  return (
    <View>
      {/* Render the Category component and pass a function as a prop */}
      {/* The function takes the selected category and calls GetPetList */}
      <Category category={(value) => GetPetList(value)} />
      <FlatList
        style={{
          marginTop: 9,
        }}
        refreshing={loader} //when refreshing call loader
        onRefresh={() => GetPetList("Dogs")}
        data={petList}
        horizontal={true}
        renderItem={({ item, index }) => <PetListItem pet={item} />} //render items within a category by calling petlistitem component which passes data in param 'pet'
      />
    </View>
  );
}
