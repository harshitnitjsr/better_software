import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import AskScreen from "../screens/AskQuestion/AskScreen";
import OCRScannerScreen from "../screens/AskQuestion/OCRScannerScreen";
import AnswerScreen from "../screens/AI/AnswerScreen";
import SourceSelectorScreen from "../screens/AI/SourceSelectorScreen";
import FlashcardListScreen from "../screens/Flashcards/FlashcardListScreen";
import CreateFlashcardScreen from "../screens/Flashcards/CreateFlashcardScreen";
import FlashcardSetupScreen from "../screens/Flashcards/FlashcardSetupScreen";
import FlashcardViewScreen from "../screens/Flashcards/FlashcardViewScreen";
import QuizSetupScreen from "../screens/Quizzes/QuizSetupScreen";
import QuizScreen from "../screens/Quizzes/QuizScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ProgressScreen from "../screens/Progress/ProgressScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Ask" component={AskScreen} />
        <Stack.Screen name="OCRScanner" component={OCRScannerScreen} />
        <Stack.Screen name="Answer" component={AnswerScreen} />
        <Stack.Screen name="SourceSelector" component={SourceSelectorScreen} />
        <Stack.Screen name="FlashcardList" component={FlashcardListScreen} />
        <Stack.Screen
          name="CreateFlashcard"
          component={CreateFlashcardScreen}
        />
        <Stack.Screen
          name="FlashcardSetup"
          component={FlashcardSetupScreen}
          options={{ title: "Create Flashcard Set" }}
        />
        <Stack.Screen
          name="FlashcardView"
          component={FlashcardViewScreen}
          options={{ title: "Study Flashcards" }}
        />
        <Stack.Screen
          name="QuizSetup"
          component={QuizSetupScreen}
          options={{ title: "Create Quiz" }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: "Quiz" }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
