import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function CreateFlashcardScreen({ navigation }: any) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  function handleCreate() {
    console.log("Created flashcard:", { front, back });
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Create Flashcard</Text>
      <TextInput
        placeholder="Front"
        value={front}
        onChangeText={setFront}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="Back"
        value={back}
        onChangeText={setBack}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <Button title="Create" onPress={handleCreate} />
    </View>
  );
}
