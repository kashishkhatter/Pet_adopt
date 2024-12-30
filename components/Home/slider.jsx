import { View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { FlatList, Image } from "react-native";

//slider images of home screen
export default function Slider() {
  const [sliderList, setSliderList] = useState([]); // State to store slider data fetched from Firestore
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    // useEffect hook to fetch slider data when the component mounts

    GetSliders();
  }, []); // Empty dependency array ensures this runs only once

  const GetSliders = async () => {
    // Function to fetch slider data from Firestore

    try {
      const snapshot = await getDocs(collection(db, "Sliders")); // Fetch documents from the "Sliders" collection
      const sliders = snapshot.docs.map((doc) => doc.data()); // Map through the documents to extract data
      setSliderList(sliders); // Update the state with the fetched data
    } catch (error) {
      console.error("Error fetching slider data: ", error);
    }
  };

  return (
    <View style={{ marginTop: 1 }}>
      <FlatList // Render the slider images using FlatList
        data={sliderList} // Pass the slider data to FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()} // Use the index as the key for list items
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 20,
              overflow: "hidden",
              marginRight: 20,
              width: screenWidth * 0.9,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Image
              source={{ uri: item?.image_url }} // Set the image source using the URL from the item
              style={{
                width: "100%",
                height: 205,
                resizeMode: "cover",
              }}
            />
          </View>
        )}
      />
    </View>
  );
}
