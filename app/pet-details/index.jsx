import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"; // Importing `useLocalSearchParams` to get route parameters passed to this screen
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// screen with info about selected pet
export default function PetDetails() {
  const pet = useLocalSearchParams(); // Retrieves the parameters passed to this screen i.e. pet details for the pet selected
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Remove header
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const InitiateChat = async () => {
    try {
      // Validate user and pet data(if available)
      if (!user?.primaryEmailAddress?.emailAddress) {
        throw new Error("User email is missing.");
      }

      if (!pet?.email) {
        throw new Error("Pet email is missing.");
      }

      const userEmail = user.primaryEmailAddress.emailAddress; //logged in user mail
      const petEmail = pet.email; //mail of pet owner

      //Creates two IDs for checking the existence of a chat between the user and the pet(owner) in Firestore.
      const docId1 = `${userEmail}_${petEmail}`; // Create a unique document ID for the chat
      const docId2 = `${petEmail}_${userEmail}`; // Reverse ID to check both ways

      // Check if a chat already exists
      const q = query(
        collection(db, "Chat"), // Query the "Chat" collection in Firestore
        where("id", "in", [docId1, docId2]) // Check if either of the document IDs already exist
      );

      const querySnapshot = await getDocs(q); // Fetch documents from Firestore

      // If a chat exists between the two already, navigate to it
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // Loop through the existing chats
          router.push({
            pathname: "/chat", // Navigate to the existing chat
            params: { id: doc.id }, // Pass the chat ID to the chat screen
          });
        });
        return; // Exit early
      }

      // If no chat exists, create a new one and then navigate
      const newChatData = {
        id: docId1, // Use the first document ID
        users: [
          // Information about the users in the chat
          {
            email: userEmail, //logged in user
            image_url: user?.imageUrl || "",
            name: user?.fullName || "Anonymous",
          },
          {
            email: petEmail, //pet owner
            image_url: pet?.userImage || "",
            name: pet?.userName,
          },
        ],
        userIds: [user?.primaryEmailAddress?.emailAddress, pet?.email], //mails of both user and pet owner
      };

      await setDoc(doc(db, "Chat", docId1), newChatData); // Create the new chat document in Firestore

      // Navigate to the newly created chat
      router.push({
        pathname: "/chat",
        params: { id: docId1 },
      });
    } catch (error) {
      console.error("Error initiating chat:", error);
      alert(error.message || "Unable to initiate chat. Please try again.");
    }
  };

  return (
    <View>
      {/* Pet Info - pass 'pet' para with selected pet info to petinfo component to display details */}
      <ScrollView>
        <PetInfo pet={pet} />
        {/* Pet SubInfo/ Properties */}
        <PetSubInfo pet={pet} />
        {/* About */}
        <AboutPet pet={pet} />
        {/* Owner details */}
        <OwnerInfo pet={pet} />

        <View
          style={{
            height: 70,
          }}
        ></View>
      </ScrollView>

      {/* Adopt me button (should stay in place: Not scrollable so keep this out of scrollview) */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <TouchableOpacity
          onPress={InitiateChat}
          style={{
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            alignItems: "center", // Center the text
          }}
        >
          <Text
            style={{
              color: "white", // Ensure text color contrasts background
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            Adopt Me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
