import React from "react";
import { View, Text, Button } from "react-native";

export default function SourceSelectorScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>AI Source Selector (stub)</Text>
      <Text>Choose: Gemini, GPT-4, LLaMA, Ollama</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
