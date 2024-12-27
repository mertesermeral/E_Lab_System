import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Kilavuz")}
      >
        <Text style={styles.buttonText}>Kılavuz Oluşturma</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("KilavuzList")}
      >
        <Text style={styles.buttonText}>Kılavuz Listeleme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TahlilEkle")}
      >
        <Text style={styles.buttonText}>Tahlil Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TahlilList")}
      >
        <Text style={styles.buttonText}>Tahlil Listeleme</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminDashboard;
