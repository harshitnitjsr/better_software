import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }: any) {
  const menuItems = [
    {
      title: "Ask a Question",
      icon: "💬",
      route: "Ask",
      colors: ["#667eea", "#764ba2"],
    },
    {
      title: "Scan Question",
      icon: "📷",
      route: "OCRScanner",
      colors: ["#f093fb", "#f5576c"],
    },
    {
      title: "My Flashcards",
      icon: "🎴",
      route: "FlashcardList",
      colors: ["#4facfe", "#00f2fe"],
    },
    {
      title: "Take Quiz",
      icon: "📝",
      route: "QuizSetup",
      colors: ["#43e97b", "#38f9d7"],
    },
    {
      title: "My Progress",
      icon: "📊",
      route: "Progress",
      colors: ["#fa709a", "#fee140"],
    },
    {
      title: "Profile",
      icon: "👤",
      route: "Profile",
      colors: ["#a8edea", "#fed6e3"],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Education AI</Text>
        <Text style={styles.subtitle}>Your AI-powered learning companion</Text>
      </LinearGradient>

      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={item.colors}
              style={styles.menuCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 40,
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
});
