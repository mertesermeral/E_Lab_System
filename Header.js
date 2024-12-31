import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"; // İkonlar için
import { auth } from "./firebase"; // Firebase bağlantısı
import { signOut } from "firebase/auth";

const Header = ({ navigation, routeName }) => {
  const handleLogout = () => {
    Alert.alert("Uyarı", "Oturumdan çıkmak istiyor musunuz?", [
      {
        text: "Hayır",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Evet",
        onPress: () => {
          signOut(auth)
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }], // Tüm geçmişi siler ve "Home" ekranına yönlendirir
              });
            })
            .catch((error) => {
              console.error("Çıkış yapılamadı:", error);
              Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu.");
            });
        },
      },
    ]);
  };

  return (
    <>
      <StatusBar backgroundColor="#0058a3" barStyle="light-content" />
      <View style={styles.headerContainer}>
        {navigation.canGoBack() ? (
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {routeName.startsWith("User") && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("UserProfile")}
          >
            <MaterialCommunityIcons name="account-circle" size={28} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0058a3",
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 56, // Header yüksekliği
    elevation: 4, // Android için gölge efekti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconButton: {
    padding: 5,
  },
  profileButton: {
    paddingHorizontal: 10,
  },
  logoutButton: {
    padding: 5,
  },
  placeholder: {
    width: 28,
  },
});

export default Header;
