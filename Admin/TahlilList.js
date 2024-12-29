import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const TahlilList = ({ navigation }) => {
  const [tahliller, setTahliller] = useState([]);
  const [filteredTahliller, setFilteredTahliller] = useState([]); // Filtrelenmiş liste
  const [searchQuery, setSearchQuery] = useState(""); // Arama kutusundaki değer

  useEffect(() => {
    const fetchTahliller = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tahliller"));
        const fetchedTahliller = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTahliller(fetchedTahliller);
        setFilteredTahliller(fetchedTahliller); // Başlangıçta tüm tahliller gösterilecek
      } catch (error) {
        console.error("Tahliller çekilemedi: ", error);
      }
    };

    fetchTahliller();
  }, []);

  // Arama kutusunda yazılan değere göre filtreleme işlemi
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredTahliller(tahliller); // Arama kutusu boşsa, tüm verileri göster
    } else {
      const filtered = tahliller.filter((tahlil) =>
        tahlil.fullName.toLowerCase().includes(text.toLowerCase()) // isme göre filtreleme
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
        onChangeText={handleSearch} // Her yazıldığında filtreleme yapılır
      />
      <FlatList
        data={filteredTahliller}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("TahlilDetay", { tahlilId: item.id })}
          >
            <Text style={styles.listItemText}> {item.fullName} - {item.reportDate}</Text>
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
    color: "#0058a3", // Ana başlık rengi
    textAlign: "center",
    marginBottom: 20,

  },
  listItem: {
    width: "100%",
    backgroundColor: "#0058a3", // Ana buton rengi
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
