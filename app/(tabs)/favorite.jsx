import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./../../components/Home/PetListItem";

export default function Favorite() {
  const { user } = useUser(); // Destructuring user from Clerk hook for the logged-in user
  const [favIds, setFavIds] = useState([]); // State to store favorite pet IDs
  const [favPetList, setFavPetList] = useState([]); // State to store pet data based on favorites
  const [loader, setLoader] = useState(false); //loader to reload page to update(by def not loading)

  useEffect(() => {
    if (user) GetFavPetIds(); // Fetch favorite pet IDs when the user is available
  }, [user]);

  const GetFavPetIds = async () => {
    setLoader(true); //start loading
    const result = await Shared.GetFavList(user); // Shared method to get favorite IDs from the user
    setFavIds(result?.favorites || []); // Set the favorite IDs to state (defaulting to an empty array if none)
    setLoader(false); //after loaded stop
  };

  useEffect(() => {
    // Effect hook that runs whenever favorite pet IDs are updated
    if (favIds.length > 0) GetFavPetList(); // Fetch pet details only if there are favorite pet IDs
  }, [favIds]);

  const GetFavPetList = async () => {
    // Function to fetch pet data from Firestore based on the favorite pet IDs
    setLoader(true); //load
    try {
      const q = query(collection(db, "Pets"), where("id", "in", favIds)); // Firestore query to fetch pets whose ID is in the favorite list
      const querySnapshot = await getDocs(q); // Execute the query to get the pet documents
      const pets = querySnapshot.docs.map((doc) => doc.data()); // Extract pet data from each document
      setFavPetList(pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
    setLoader(false); //loaded
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Favorites</Text>
      <FlatList
        data={favPetList} // Pass the list of favorite pets to the FlatList
        onRefresh={GetFavPetIds} //on reloading recall the func to update changes
        refreshing={loader} //call loader
        key={favPetList.length > 1 ? "multi" : "single"} // Unique key based on number of columns
        keyExtractor={(item) => item.id.toString()} // Extract unique keys for each pet
        numColumns={favPetList.length > 1 ? 2 : 1} // Set the number of columns based on the number of pets
        contentContainerStyle={styles.listContainer}
        renderItem={(
          { item } //Render each pet item using the PetListItem component
        ) => (
          <View style={styles.itemContainer}>
            <PetListItem pet={item} />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No favorites yet!</Text> // Display this text if there are no favorites
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    flex: 1,
  },
  headerText: {
    fontFamily: "outfit-medium",
    fontSize: 30,
    marginBottom: 10,
  },
  listContainer: {
    justifyContent: "space-between",
  },
  itemContainer: {
    flex: 1, // Ensures items share the row space evenly
    margin: 10,
    maxWidth: "50%", // Ensures two items per row
    alignItems: "center", // Centers the content in the container
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
});
