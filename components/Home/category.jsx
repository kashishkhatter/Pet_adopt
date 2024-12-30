import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

// Component to display pet categories on the home screen
export default function Category({ category }) {
  //pass category selected as para to parent(petlistbycategory) to display pet list based on category
  //pass selected category as para to petlistbycategory

  const [categoryList, setCategoryList] = useState([]); // State to store categories of pets
  const [selectedCategory, setSelectedCategory] = useState("Dogs"); // State to track the selected category, default is "Dogs"

  // useEffect hook to fetch categories when the component mounts
  useEffect(() => {
    GetCategories(); // Call the function to fetch categories
  }, []); // Empty dependency array ensures this runs only once

  // Function to fetch categories from the "Category" collection in Firestore
  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category")); // Fetch documents from the "Category" collection
    const categories = snapshot.docs.map((doc) => doc.data()); // Map through documents to extract data
    setCategoryList(categories); // Update the state with the fetched categories
  };

  return (
    <View style={{ marginTop: 5 }}>
      {/* Header text for the category section */}
      <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>
        Category
      </Text>

      {/* FlatList to display categories in a grid layout */}
      <FlatList
        data={categoryList} // Data for the FlatList comes from categoryList
        numColumns={4} // Display 4 items per row
        keyExtractor={(item, index) => index.toString()} // Use index as the key for list items
        renderItem={({ item }) => (
          // TouchableOpacity to make each category item selectable
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name); //set selected category
              category(item.name); //set category para of func to selected item
            }}
            style={{
              flex: 1, // Flex to equally distribute items
              margin: 5, // Margin for spacing between items
              alignItems: "center", // Center the items horizontally
            }}
          >
            {/* View to wrap the category image with conditional styling */}
            <View
              style={{
                backgroundColor:
                  selectedCategory === item?.name // Conditional background color
                    ? Colors.SECONDARY // Highlight color if selected
                    : Colors.LIGHT_PRIMARY, // Default color if not selected
                padding: 10, // Padding around the content
                alignItems: "center", // Center the content horizontally
                borderWidth: 1, // Border width
                borderRadius: 15, // Rounded corners
                borderColor:
                  selectedCategory === item?.name // Conditional border color
                    ? Colors.SECONDARY // Highlight color if selected
                    : Colors.PRIMARY, // Default color if not selected
              }}
            >
              {/* Image to display the category icon */}
              <Image
                source={{ uri: item?.image_url }} // Image URL from the category item
                style={{ width: 45, height: 45 }} // Image dimensions
                resizeMode="contain" // Scale the image to fit within the dimensions
              />
            </View>

            {/* Text to display the category name */}
            <Text
              style={{
                textAlign: "center", // Center the text horizontally
                fontFamily: "outfit", // Custom font style
              }}
            >
              {item?.name} {/* Display the category name */}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
