import { View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";

export default function MarkFav({ pet, color = "black" }) {
  const { user } = useUser(); // Fetch the authenticated user's details.
  const [favList, setFavList] = useState(); // Fetch the authenticated user's details.

  useEffect(() => {
    // Fetch the user's favorites list using GetFav func when the component mounts or the user changes.
    user && GetFav();
  }, [user]);

  // Fetch favorites from Firestore
  const GetFav = async () => {
    const result = await Shared.GetFavList(user); //for logged in 'user' getfavlist from shared component
    console.log(result);
    setFavList(result?.favorites ? result?.favorites : []); //If result?.favorites exists (i.e., the user has a list of favorite pet IDs), it uses that list. Otherwise, it initializes favList as an empty array.
  };

  // Add to favorites
  const AddToFav = async () => {
    const updatedFavList = [...favList, pet.id]; // Add the current pet's ID to the favorites list..
    setFavList(updatedFavList); // Update the UI immediately.
    await Shared.UpdateFav(user, updatedFavList); // Update the database.
  };

  // Remove from favorites
  const RemoveFromFav = async () => {
    const updatedFavList = favList.filter((id) => id !== pet.id); // Remove the pet ID from the favorites list(only add ids that do not match to the selcted if into the favList arr)
    setFavList(updatedFavList); // Update the UI immediately.
    await Shared.UpdateFav(user, updatedFavList); // Update the database.
  };

  return (
    <View>
      {favList?.includes(pet.id) ? (
        // If the pet is in favorites, show the red heart and allow removal if red heart clicked
        <Pressable onPress={() => RemoveFromFav()}>
          <FontAwesome name="heart" size={30} color="red" />
        </Pressable>
      ) : (
        // If the pet is not in favorites, show the black heart and allow addition if clicked
        <Pressable onPress={() => AddToFav()}>
          <Feather
            name="heart"
            size={30}
            color={color}
            style={{
              flexShrink: 0, // Prevent the heart icon from shrinking
            }}
          />
        </Pressable>
      )}
    </View>
  );
}
