import React from "react";
import { View, Text, TouchableOpacity, StyleSheet,Alert, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Kapı simgesi için
import { auth } from "./firebase"; // Firebase bağlantısı
import { signOut } from "firebase/auth";

const Header = ({navigation }) => {
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
                    routes: [{ name: "Home" }], // Tüm geçmiş silinir ve "Home" ekranına yönlendirilir
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
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        ) : (
        <View style={styles.placeholder} />
        )}
      
      <TouchableOpacity onPress={() => handleLogout(navigation)} style={styles.logoutButton}>
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
    shadowColor: "#000", // iOS gölge ayarları
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 5,
  },
  placeholder: {
    width: 28, // Geri tuşunun olmadığı durumlarda boş alan bırakır
  },
});

export default Header;