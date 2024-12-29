import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, BackHandler } from "react-native";
import { db, auth } from "../firebase"; // Hem db hem de auth import edildi
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

const UserTahlilList = ({ navigation }) => {
  const [tahliller, setTahliller] = useState([]);
  const [userTc, setUserTc] = useState("");
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
    const fetchTahliller = async () => {
      try {
        const email = auth.currentUser?.email; // Giriş yapan kullanıcının e-postası
        if (!email) {
          console.error("Giriş yapan kullanıcı bulunamadı.");
          return;
        }

        const tc = email.split("@")[0]; // E-posta adresinden TC'yi çıkar
        setUserTc(tc);

        const querySnapshot = await getDocs(collection(db, "tahliller"));
        const userTahliller = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((tahlil) => tahlil.tcNumber === tc); // TC'ye göre filtreleme

        setTahliller(userTahliller);
      } catch (error) {
        console.error("Tahliller alınamadı:", error);
      }
    };

    fetchTahliller();
  }, []);

  // Geri tuşu kontrolü
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
      <Text style={styles.title}>Tahlil Listesi</Text>
      {tahliller.length > 0 ? (
        <FlatList
          data={tahliller}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("UserTahlil", { tahlilId: item.id })}
            >
              <Text>{item.fullName} - {item.reportDate}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noData}>Yükleniyor...</Text>
      )}
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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  listItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  noData: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
  },
});

export default UserTahlilList;
