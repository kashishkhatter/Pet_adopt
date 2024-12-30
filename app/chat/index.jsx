import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore"; // Import getDoc from Firestore
import { db } from "../../config/FirebaseConfig"; // Ensure Firebase config is properly set
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat } from "react-native-gifted-chat";
import { useState } from "react";
import moment from "moment";

export default function ChatScreen() {
  const params = useLocalSearchParams(); // Retrieve parameters from route
  const { user } = useUser();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (params?.id) {
      GetUserDetails(); // If id exists in params, call GetUserDetails
    } else {
      console.log("No chat ID found in params."); // If no id, log an error
    }

    // Subscribe to Firestore for real-time message updates
    const unsubscribe = onSnapshot(
      collection(db, "Chat", params?.id, "Messages"), //within chats colln make a messages collection with the chat history
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          _id: doc.id, // Each message gets a unique ID
          ...doc.data(), // Spread the data from the Firestore document into the message
        }));
        setMessages(messageData); //update state when new messages
      }
    );
    return () => unsubscribe();
  }, [params]); // Run the effect whenever params change

  const GetUserDetails = async () => {
    try {
      const docRef = doc(db, "Chat", params?.id); // Reference to Firestore document
      const docSnap = await getDoc(docRef); // Get the document snapshot from Firestore

      if (docSnap.exists()) {
        const result = docSnap.data(); // Get data from the snapshot
        console.log("Chat details:", result); // Log the retrieved chat data

        const otherUser = result?.users.filter(
          //pet owner
          (item) => item.email != user?.primaryEmailAddress?.emailAddress
        );
        console.log(otherUser);
        navigation.setOptions({
          headerTitle: otherUser[0].name, //header of chat screen has pet owners name
        });
      } else {
        console.log("No such document!"); // If document doesn't exist
      }
    } catch (error) {
      console.error("Error getting document:", error); // Catch and log any errors during document retrieval
    }
  };

  const onSend = async (newMessage) => {
    // Function to handle sending messages
    setMessages(
      (previousMessage) => GiftedChat.append(previousMessage, newMessage) // Append the new message to the existing ones
    );
    newMessage[0].createdAt = moment().format("MM-DD-YYYY HH:mm:ss"); // Add a timestamp to the new message

    // Save the new message to Firestore
    await addDoc(collection(db, "Chat", params.id, "Messages"), newMessage[0]);
  };
  return (
    <GiftedChat //library for chat ui(import)
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
    />
  );
}
