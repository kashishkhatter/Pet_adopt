import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // Importing Picker component
import { useNavigation, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";

const AddPetScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
  }, []);
  const [petData, setPetData] = useState({
    name: "",
    breed: "",
    age: "",
    sex: "male", // Default gender
    weight: "",
    address: "",
    about: "",
    category: "Cats", // Default category
    image: null,
    userName: "",
    userImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // Image URI state
  const [hasPermission, setHasPermission] = useState(null);

  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleChange = (key, value) => {
    setPetData({ ...petData, [key]: value });
  };

  // Image Picker
  const imagePicker = async () => {
    if (hasPermission === null) {
      alert("Requesting permission for accessing media.");
    } else if (hasPermission === false) {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //only img selection allow
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Ensure the image URI is updated correctly
      setImage(result.assets[0].uri);
      handleChange("image", result.assets[0].uri); // Update petData with image URI
    } else {
      ToastAndroid.show("Image selection was canceled.", ToastAndroid.SHORT);
    }
  };

  // ImgBB Image Upload Function
  const uploadImageToImgBB = async (imageUri) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri, // The URI of the image to upload
      type: "image/jpeg", // Assuming JPEG image, you can adjust based on the image type
      name: "image.jpg",
    });

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=e6cba13192940bd98eb54eb451a3c856", // Endpoint with ImgBB API key
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //store the selected image url at ImgBB storage and if storage successfull gets its uri
      if (response.data.success) {
        return response.data.data.url; // Return the uploaded image's URL if successful
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error);
      throw error;
    }
  };

  // Submit Form func
  const onSubmit = async () => {
    if (
      !petData.name ||
      !petData.breed ||
      !petData.age ||
      !petData.sex ||
      !petData.weight ||
      !petData.address ||
      !petData.about ||
      !petData.category ||
      !image
    ) {
      ToastAndroid.show("Please enter all details", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImageToImgBB(image); // Upload image to ImgBB and get the URL

      // Formatting the data to match the collection structure (same titles as in pets collection of fb)
      const dataToSubmit = {
        name: petData.name, // Pet Name
        breed: petData.breed, // Breed
        age: petData.age, // Age
        sex: petData.sex, // Sex
        weight: petData.weight, // Weight
        address: petData.address, // Address
        about: petData.about, // About (Description)
        category: petData.category, // Category
        id: String(Math.floor(Math.random() * 1000)), // Random ID (or you can generate this differently)
        image_url: imageUrl, // Image URL from ImgBB
        userName: user?.fullName, //logged in user name
        userImage: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      };

      // Add pet data to Firebase Firestore
      await addDoc(collection(db, "Pets"), dataToSubmit);
      setLoading(false);
      ToastAndroid.show("Pet added successfully!", ToastAndroid.SHORT);
      router.replace("/(tabs)/home"); //after form submission redirect to home page

      // Reset form
      setPetData({
        name: "",
        breed: "",
        age: "",
        sex: "male", // Default gender
        weight: "",
        address: "",
        about: "",
        category: "Cats", // Default category
        image: null,
        userName: "",
        userImage: "",
      });
      setImage(null); // Reset image URI after submission
    } catch (error) {
      setLoading(false);
      ToastAndroid.show("Error adding pet", ToastAndroid.SHORT);
      console.error("Error adding document: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Add New Pet for adoption
      </Text>
      <TouchableOpacity onPress={imagePicker} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} /> //if selcted then display selected img
        ) : (
          <Image
            source={require("./../../assets/images/paw.png")} //default img before selection
            style={styles.image}
          />
        )}
      </TouchableOpacity>

      <Text style={styles.uploadText}>Upload Image</Text>

      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={petData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Category Dropdown */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={petData.category}
          onValueChange={(itemValue) => handleChange("category", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Dogs" value="Dogs" />
          <Picker.Item label="Cats" value="Cats" />
          <Picker.Item label="Fish" value="Fish" />
          <Picker.Item label="Birds" value="Birds" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={petData.breed}
        onChangeText={(text) => handleChange("breed", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={petData.age}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("age", text)}
      />

      {/* Gender Dropdown */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={petData.sex}
          onValueChange={(itemValue) => handleChange("sex", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={petData.weight}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("weight", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={petData.address}
        onChangeText={(text) => handleChange("address", text)}
      />
      <TextInput
        style={[styles.input, { height: 110, textAlignVertical: "top" }]}
        placeholder="About"
        value={petData.about}
        multiline={true} // Enable multiline input
        onChangeText={(text) => handleChange("about", text)}
      />

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8", // Light background color for better contrast
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5, // Adjusted spacing
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    width: 150,
    height: 150,
  },
  uploadText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    color: "#555", // Light grey for the label
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY, // Replace with your primary color
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "outfit-medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default AddPetScreen;
