import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
//component of selectedpet screen to show about pet section
export default function AboutPet({ pet }) {
  // state to control Read More/Read Less
  const [readMore, setReadMore] = useState(false); //by def false( If readMore is true, the full text is shown (with numberOfLines set to 20), and if false, the text is truncated to 3 lines.)

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        About {pet?.name}
      </Text>

      <Text
        numberOfLines={readMore ? 20 : 3} // Toggle between showing 3 lines or full text (by def 3-redMore(false)
        style={{
          fontFamily: "outfit",
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {pet?.about}
      </Text>

      <Pressable
        onPress={() => setReadMore((prev) => !prev)} // Toggle readMore state ( takes the previous state value (prev), then returns the opposite value (!prev). If prev was true (meaning the text was fully displayed), it will change to false (collapse the text). If it was false, it changes to true (expand the text).)
        style={{
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 14,
            color: Colors.SECONDARY, // Secondary color for the button
            textDecorationLine: "underline", // Make it look like a link
          }}
        >
          {readMore ? "Read Less" : "Read More"} {/* Toggle text */}
        </Text>
      </Pressable>
    </View>
  );
}
