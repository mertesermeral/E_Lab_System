import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, BackHandler, Image } from "react-native";
import { db, auth } from "../firebase"; // Firestore ve auth bağlantısı
import { collection, getDocs } from "firebase/firestore";

const UserTahlilList = ({ navigation }) => {
  const [tahliller, setTahliller] = useState([]);
  const [userTc, setUserTc] = useState("");
  const [userName, setUserName] = useState(""); // Kullanıcı adı

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

        if (userTahliller.length > 0) {
          setUserName(userTahliller[0].fullName || "Bilinmeyen"); // İlk tahlilden fullName bilgisi al
        } else {
          setUserName("Bilinmeyen");
        }
      } catch (error) {
        console.error("Tahliller alınamadı:", error);
      }
    };

    fetchTahliller();
  }, []);

  // Geri tuşu kontrolü
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        // Sadece bu ekran odaktaysa çalışır
        Alert.alert("Uyarı", "Oturumdan çıkmak istiyor musunuz?", [
          {
            text: "Hayır",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Evet",
            onPress: () => navigation.replace("Home"),
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
      <Image
        source={require("../assets/patient.png")}
        style={[styles.icon, { width: "100%", height: "30%" }]}
      />
      <Text style={styles.title}>Tahlil Listesi</Text>
      <Text style={styles.welcomeText}>
        Hoşgeldiniz, <Text style={styles.userName}>{userName}</Text>
      </Text>
      {tahliller.length > 0 ? (
        <FlatList
          data={tahliller}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("UserTahlil", { tahlilId: item.id })}
            >
              <Text style={styles.listItemText}>
                {item.fullName} - {item.reportDate}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noData}>Yükleniyor...</Text>
      )}
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
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  userName: {
    fontWeight: "bold",
    color: "#0058a3",
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
  noData: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
  },
  icon: {
    resizeMode: "contain",
    marginBottom: 20,
  },
});

export default UserTahlilList;
