import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const KilavuzList = ({ navigation }) => {
  const [guides, setGuides] = useState([]); // Kılavuz verileri için state

  // Kılavuz verilerini çekme fonksiyonu
  const fetchGuides = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "guides")); // Firebase'den verileri çek
      const fetchedGuides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGuides(fetchedGuides); // Verileri state'e ata
    } catch (error) {
      console.error("Kılavuzlar çekilemedi: ", error);
    }
  };

  // Sayfa her odaklandığında veri çekme işlemini tetikler
  useFocusEffect(
    useCallback(() => {
      fetchGuides(); // Kılavuz verilerini güncelle
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Listesi</Text>
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id} // Her öğeyi ID'ye göre anahtar yap
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#0058a3",
    textAlign: "center",
    marginBottom: 20,
  },
  listItem: {
    width: "100%",
    backgroundColor: "#0058a3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  listItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default KilavuzList;
