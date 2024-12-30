import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore"; // Import functions for reading (getDoc), writing (setDoc), and creating document references (doc).
import { db } from "./../config/FirebaseConfig"; // Import the Firestore database instance (db).

// Function to get or initialize a user's favorite list.
const GetFavList = async (user) => {
  // Fetch a document from the "UserFavPet" collection using the user's email address as the document ID.
  const docSnap = await getDoc(
    doc(db, "UserFavPet", user.primaryEmailAddress.emailAddress)
  );

  // If the document exists, return its data.
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // If the document does not exist, create a new one with an empty favorites list.
    await setDoc(doc(db, "UserFavPet", user.primaryEmailAddress.emailAddress), {
      email: user.primaryEmailAddress.emailAddress, // Save the user's email.
      favorites: [], // Initialize the favorites list as an empty array.
    });
  }
};

const UpdateFav = async (user, favorites) => {
  //func to update fav list if something added/removed
  const docRef = doc(db, "UserFavPet", user?.primaryEmailAddress?.emailAddress);
  try {
    // update the document's `favorites` field with the provided value.
    await updateDoc(docRef, {
      favorites: favorites, // The new value for the `favorites` field.
    });
  } catch (e) {
    console.error("Error updating favorites:", e);
  }
};

// Export the `GetFavList` & 'UpdateFav function as part of an object for structured imports.
export default {
  GetFavList,
  UpdateFav,
};
