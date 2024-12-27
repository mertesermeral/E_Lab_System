import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminLoginScreen from "./Login/AdminLoginScreen";
import UserLoginScreen from "./Login/UserLoginScreen";
import AdminDashboard from "./Admin/AdminDashboard";
import Kilavuz from "./Admin/Kilavuz"; 
import KilavuzList from "./Admin/KilavuzList"; 
import KilavuzTablosu from "./Admin/KilavuzTablosu"; 
import TahlilEkle from "./Admin/TahlilEkle";
import KilavuzGuncelle from "./Admin/KilavuzGuncelle";
import TahlilList from "./Admin/TahlilList";
import TahlilDetay from "./Admin/TahlilDetay";
const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoşgeldiniz</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminLogin")}
      >
        <Text style={styles.buttonText}>Admin Girişi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("UserLogin")}
      >
        <Text style={styles.buttonText}>Kullanıcı Girişi</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserLogin"
          component={UserLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Kilavuz"
          component={Kilavuz} // GuideCreation'ı ekledik
          options={{ headerShown: true, title: "Kılavuz Oluştur" }}
        />
        <Stack.Screen
          name="KilavuzList"
          component={KilavuzList}
          options={{ title: "Kılavuzlar" }}
        />
        <Stack.Screen
          name="KilavuzTablosu"
          component={KilavuzTablosu}
          options={{ title: "Kılavuz Tablosu" }}
        />
        <Stack.Screen
          name="TahlilEkle"
          component={TahlilEkle}
          options={{ title: "Tahlil Ekle" }}
        />
      <Stack.Screen
          name="KilavuzGuncelle"
          component={KilavuzGuncelle}
          options={{ title: "Kılavuz Güncelle" }}
        />
      <Stack.Screen
          name="TahlilList"
          component={TahlilList}
          options={{ title: "Tahliller Listesi" }}
        />
      <Stack.Screen
          name="TahlilDetay"
          component={TahlilDetay}
          options={{ title: "Tahlil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
    marginBottom: 40,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
