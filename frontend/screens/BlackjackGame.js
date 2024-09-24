import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const generateDeck = () => {
  let deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ value, suit });
    });
  });
  return deck;
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aceCount = 0;

  hand.forEach((card) => {
    if (card.value === "A") {
      aceCount += 1;
      value += 11;
    } else if (["J", "Q", "K"].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  });

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount -= 1;
  }

  return value;
};

const BlackjackGame = ({ navigation }) => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);
  const [playerWins, setPlayerWins] = useState(false);
  const [tie, setTie] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const shuffleDeck = (newDeck) => {
    let shuffledDeck = [...newDeck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };

  const dealInitialCards = () => {
    const newDeck = shuffleDeck(generateDeck());
    setDeck(newDeck);
    const initialPlayerHand = [newDeck[0], newDeck[2]];
    const initialDealerHand = [newDeck[1], newDeck[3]];
    setPlayerHand(initialPlayerHand);
    setDealerHand(initialDealerHand);
    setPlayerTotal(calculateHandValue(initialPlayerHand));
    setDealerTotal(calculateHandValue([newDeck[1]]));
    setGameStarted(true);
    setGameOver(false);
    setPlayerTurn(true);
    setPlayerWins(false);
    setTie(false);
    setShowConfetti(false);
  };

  const handleHit = () => {
    const newCard = deck.pop();
    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);
    const playerValue = calculateHandValue(newPlayerHand);
    setPlayerTotal(playerValue);

    if (playerValue > 21) {
      setGameOver(true);
      setPlayerTurn(false);
      setPlayerWins(false);
    }
  };

  const handleStand = () => {
    setPlayerTurn(false);
    setDealerTotal(calculateHandValue(dealerHand));
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setGameStarted(false);
    setPlayerTurn(true);
    setPlayerWins(false);
    setTie(false);
    setShowConfetti(false);
  };

  const checkForWinner = () => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) {
      setGameOver(true);
      setPlayerWins(false);
    } else if (dealerValue > 21) {
      setGameOver(true);
      setPlayerWins(true);
      setShowConfetti(true);
    } else if (dealerValue > playerValue) {
      setGameOver(true);
      setPlayerWins(false);
    } else if (playerValue > dealerValue) {
      setGameOver(true);
      setPlayerWins(true);
      setShowConfetti(true);
    } else if (playerValue === dealerValue) {
      setGameOver(true);
      setTie(true);
    }
  };

  useEffect(() => {
    if (!playerTurn && gameStarted) {
      let dealerValue = calculateHandValue(dealerHand);
      const newHand = [...dealerHand];

      while (dealerValue < 17) {
        const newCard = deck.pop();
        newHand.push(newCard);
        dealerValue = calculateHandValue(newHand);
      }

      setDealerHand(newHand);
      setDealerTotal(dealerValue);
    }
  }, [playerTurn]);

  useEffect(() => {
    if (gameOver || !playerTurn) {
      checkForWinner();
    }
  }, [dealerHand]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blackjack</Text>
      {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />}
      {!gameStarted ? (
        <Button title="Start Game" onPress={dealInitialCards} />
      ) : (
        <>
          <View style={styles.hands}>
            <Text>Your Hand (Total: {playerTotal})</Text>
            <View style={styles.cardContainer}>
              {playerHand.map((item, index) => (
                <View key={index.toString()} style={styles.card}>
                  <Text style={styles.cardValue}>{item.value}</Text>
                  <Text style={styles.cardSuit}>{item.suit}</Text>
                </View>
              ))}
            </View>

            <Text>Dealer's Hand (Total: {dealerTotal})</Text>
            <View style={styles.cardContainer}>
              {dealerHand.map((item, index) => (
                <View key={index.toString()} style={styles.card}>
                  <Text style={styles.cardValue}>{item.value}</Text>
                  <Text style={styles.cardSuit}>{item.suit}</Text>
                </View>
              ))}
            </View>
          </View>

          {playerTurn ? (
            <>
              <Button title="Hit" onPress={handleHit} />
              <Button title="Stand" onPress={handleStand} />
            </>
          ) : null}

          {gameOver && (
            <>
              <Text>
                {tie ? "It's a Tie!" : playerWins ? "You Win!" : "Dealer Wins!"}
              </Text>
              <Button title="Play Again" onPress={resetGame} />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4C51BF",
    marginBottom: 20,
  },
  hands: {
    marginVertical: 20,
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 60,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#2D3748",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardSuit: {
    fontSize: 18,
    color: "#CBD5E0",
  },
});

export default BlackjackGame;
