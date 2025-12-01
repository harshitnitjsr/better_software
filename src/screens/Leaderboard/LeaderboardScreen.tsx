import React from "react";
import { View, Text, FlatList } from "react-native";

export default function LeaderboardScreen() {
  const users = [
    { id: "1", name: "Alice", xp: 1200 },
    { id: "2", name: "Bob", xp: 950 },
    { id: "3", name: "Charlie", xp: 820 },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Leaderboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, marginBottom: 8 }}>
            <Text>
              {item.name} - {item.xp} XP
            </Text>
          </View>
        )}
      />
    </View>
  );
}
