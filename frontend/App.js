import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import GamesScreen from "./screens/GamesScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BlackjackGame from "./screens/BlackjackGame";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Games" component={GamesScreen} />
        <Tab.Screen name="AI Chatbot" component={ChatbotScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen
          name="Blackjack"
          component={BlackjackGame}
          options={{ tabBarButton: () => null, tabBarVisible: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
