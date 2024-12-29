import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const AdminDashboard = ({ navigation }) => {
  const handleLogout = (navigation) => {
  
    signOut(auth)
      .then(() => {
        Alert.alert("Uyarı", "Oturumdan çıkmak istiyor musunuz?", [
          {
            text: "Hayır",
            onPress: () => null,
            style: "cancel",
          },
          { text: "Evet", onPress: () => navigation.replace("Home") },
        ])
      })
      .catch((error) => {
        console.error("Çıkış yapılamadı:", error);
        Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu.");
      });
  };
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) { // Sadece bu ekran odaktaysa çalışır
        Alert.alert("Uyarı", "Oturumdan çıkmak istiyor musunuz?", [
          {
            text: "Hayır",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Evet",
            onPress: () => navigation.replace("Home")
          },
        ]);
        return true;
      }
      return false; // Alt sayfalarda varsayılan davranışı koru
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doktor Sayfası</Text>
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
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(navigation)}
      >
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7", // Açık gri arka plan
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0058a3", // Ana renk
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#0058a3", // Ana buton rengi
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 15,
  },
  switchButtonText: {
    color: "#0058a3", // Link rengi
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default AdminDashboard;
