import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const KilavuzList = ({ navigation }) => {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guides"));
        const fetchedGuides = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGuides(fetchedGuides);
      } catch (error) {
        console.error("Kılavuzlar çekilemedi: ", error);
      }
    };

    fetchGuides();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Listesi</Text>
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("KilavuzTablosu", { guideId: item.id })}
          >
            <Text style={styles.listItemText}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default KilavuzList;
