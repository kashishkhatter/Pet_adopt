import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "../../components/Inbox/UserItem";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [mappedUserList, setMappedUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) GetUserList();
  }, [user]);

  useEffect(() => {
    // Map other users whenever userList changes
    const list = userList.map((record) => {
      const otherUser = record.users?.filter(
        (u) => u?.email !== user?.primaryEmailAddress?.emailAddress
      )[0]; // Take the first "other" user
      return {
        docId: record.id,
        ...otherUser,
      };
    });
    setMappedUserList(list);
  }, [userList]);

  const GetUserList = async () => {
    setLoading(true);

    const q = query(
      collection(db, "Chat"),
      where(
        "userIds",
        "array-contains",
        user?.primaryEmailAddress?.emailAddress
      )
    );

    const querySnapshot = await getDocs(q);
    const chatData = [];
    querySnapshot.forEach((doc) => {
      chatData.push({ id: doc.id, ...doc.data() }); // Collect all data
    });

    setUserList(chatData); // Update userList once with all data
    setLoading(false);
  };

  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        Inbox
      </Text>

      <FlatList
        data={mappedUserList}
        refreshing={loading}
        onRefresh={GetUserList}
        keyExtractor={(item, index) => item.docId || index.toString()}
        renderItem={({ item }) => <UserItem userInfo={item} />}
      />
    </View>
  );
}
