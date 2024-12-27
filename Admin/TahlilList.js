import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const TahlilList = ({ navigation }) => {
  const [tahliller, setTahliller] = useState([]);

  useEffect(() => {
    const fetchTahliller = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tahliller"));
        const fetchedTahliller = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTahliller(fetchedTahliller);
      } catch (error) {
        console.error("Kılavuzlar çekilemedi: ", error);
      }
    };

    fetchTahliller();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tahlil Listesi</Text>
      <FlatList
        data={tahliller}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("TahlilDetay", { tahlilId: item.id })}
          >
            <Text style={styles.listItemText}> {item.fullName} - {new Date(item.reportDate.toDate()).toLocaleString("tr-TR", {timeZone: "Europe/Istanbul"})}</Text>
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

export default TahlilList;
