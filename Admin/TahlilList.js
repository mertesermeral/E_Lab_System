import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const TahlilList = ({ navigation }) => {
  const [tahliller, setTahliller] = useState([]);
  const [filteredTahliller, setFilteredTahliller] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTahliller = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tahliller"));
      const fetchedTahliller = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTahliller(fetchedTahliller);
      setFilteredTahliller(fetchedTahliller); // Başlangıçta tüm tahlilleri göster
    } catch (error) {
      console.error("Tahliller çekilemedi: ", error);
    }
  };

  // Sayfa odaklandığında veri çekme işlemini tetikler
  useFocusEffect(
    useCallback(() => {
      fetchTahliller(); // Tahlil verilerini güncelle
    }, [])
  );

  // Arama kutusunda yazılan değere göre filtreleme işlemi
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredTahliller(tahliller);
    } else {
      const filtered = tahliller.filter((tahlil) =>
        tahlil.fullName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTahliller(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tahlil Listesi</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="İsimle Ara"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredTahliller}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("TahlilDetay", { tahlilId: item.id })}
          >
            <Text style={styles.listItemText}>{item.fullName} - {item.reportDate}</Text>
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default TahlilList;
