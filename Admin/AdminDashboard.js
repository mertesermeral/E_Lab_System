import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, BackHandler } from "react-native";
import Kilavuz from "./Kilavuz";
import KilavuzList from "./KilavuzList";
import TahlilEkle from "./TahlilEkle";
import TahlilList from "./TahlilList";

const Drawer = createDrawerNavigator();

const DashboardHome = ({ navigation }) => {
  // Geri tuşu kontrolü
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) { // Yalnızca bu sayfa odaklıysa
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
        return true; // İşlemi engelle
      }
      return false; // Diğer ekranlarda varsayılan davranış
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove(); // Bileşen unmount olunca listener'ı kaldır
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/doctor.png")} style={styles.icon} />
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
    </View>
  );
};

const AdminDashboard = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Ana Sayfa"
      screenOptions={{
        drawerStyle: { width: 240, backgroundColor: "#f7f7f7" },
      }}
    >
      <Drawer.Screen
        name="Ana Sayfa"
        component={DashboardHome}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Kılavuz Oluşturma"
        component={Kilavuz}
        options={{ title: "Kılavuz Oluştur" }}
      />
      <Drawer.Screen
        name="Kılavuz Listeleme"
        component={KilavuzList}
        options={{ title: "Kılavuz Listesi" }}
      />
      <Drawer.Screen
        name="Tahlil Ekle"
        component={TahlilEkle}
        options={{ title: "Tahlil Ekle" }}
      />
      <Drawer.Screen
        name="Tahlil Listeleme"
        component={TahlilList}
        options={{ title: "Tahlil Listesi" }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0058a3",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#0058a3",
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
  icon: {
    resizeMode: "contain",
    marginBottom: 20,
    padding: 10,
  },
});

export default AdminDashboard;
