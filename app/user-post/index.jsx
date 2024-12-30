import { View, Text, FlatList, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import PetListItem from "../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Post",
    });
    if (user) {
      GetUserPost();
    }
  }, [user]);

  const GetUserPost = async () => {
    setLoading(true);
    try {
      console.log(
        "Fetching posts for user:",
        user?.primaryEmailAddress?.emailAddress
      );

      const q = query(
        collection(db, "Pets"),
        where("email", "==", user?.primaryEmailAddress?.emailAddress)
      );

      const querySnapshot = await getDocs(q);
      const posts = [];

      querySnapshot.forEach((doc) => {
        console.log("Fetched post:", doc.id, doc.data()); // Log ID and data
        posts.push({ id: doc.data().id, ...doc.data(), firebaseDocId: doc.id }); // Include document ID and the field 'id'
      });

      if (posts.length === 0) {
        console.log("No posts found for this user.");
      }

      setUserPostList(posts);
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    }
    setLoading(false);
  };

  const OnDeletePost = (docId, firebaseDocId) => {
    Alert.alert("Delete Post", "Do you want to delete this post?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deletePost(docId, firebaseDocId),
      },
    ]);
  };

  const deletePost = async (docId, firebaseDocId) => {
    try {
      console.log("Attempting to delete post with ID:", docId);

      // Query Firestore to find the document by the 'id' field
      const q = query(collection(db, "Pets"), where("id", "==", docId));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const postDocRef = querySnapshot.docs[0].ref; // Get the document reference
        await deleteDoc(postDocRef); // Delete the document from Firestore

        console.log("Post successfully deleted from Firestore.");

        // Update UI after successful deletion
        setUserPostList((prevList) =>
          prevList.filter((post) => post.firebaseDocId !== firebaseDocId)
        );
      } else {
        console.log("No document found with ID:", docId);
      }
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        UserPost
      </Text>

      <FlatList
        data={userPostList}
        numColumns={2}
        refreshing={loading}
        onRefresh={GetUserPost}
        keyExtractor={(item) => item.firebaseDocId} // Use firebaseDocId for unique keys
        renderItem={({ item }) => (
          <View>
            <PetListItem pet={item} />
            <Pressable
              onPress={() => OnDeletePost(item.id, item.firebaseDocId)} // Pass both ID and firebaseDocId
              style={{
                backgroundColor: Colors.LIGHT_PRIMARY,
                padding: 5,
                borderRadius: 7,
                marginTop: 5,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  textAlign: "center",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      />
      {userPostList?.length == 0 && <Text>No Post Found</Text>}
    </View>
  );
}
