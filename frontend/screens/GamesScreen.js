import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function GamesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Games Screen</Text>
      <Button
        title="Play Blackjack"
        onPress={() => navigation.navigate("Blackjack")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
