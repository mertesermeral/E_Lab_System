import React from "react";
import { Image, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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
import UserTahlil from "./User/UserTahlil";
import UserTahlilList from "./User/UserTahlilList";
import UserProfile from "./User/UserProfile";
import Header from "./Header";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const Stack = createStackNavigator();
const { width} = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/lab-technician.png")}
        style={[
          
          { width: width, height:width}, // Dinamik boyutlandırma
        ]}
      />
      <Text style={styles.title}>E-Laboratuvar Sistemi</Text>
      <Text style={styles.title}>Hoşgeldiniz</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminLogin")}
      >
        <Text style={styles.buttonText}>Doktor Girişi</Text>
        <MaterialCommunityIcons name="doctor" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("UserLogin")}
      >
        <Text style={styles.buttonText}>Hasta Girişi</Text>
        <MaterialCommunityIcons name="emoticon-sick-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={({ route, navigation }) => ({
            header: () =>
              ["Home", "AdminLogin", "UserLogin"].includes(route.name) ? null : (
                <Header navigation={navigation} routeName={route.name} />
              ),
          })}
        >
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
          name="UserTahlil"
          component={UserTahlil}
          options={{ title: "Tahlil Detayı" }}
        />
        <Stack.Screen
          name="UserTahlilList"
          component={UserTahlilList}
          options={{ title: "Tahlil Listesi" }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ title: "Admin Paneli" }}
        />
        <Stack.Screen
          name="Kilavuz"
          component={Kilavuz}
          options={{ title: "Kılavuz Oluştur" }}
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
          options={{ title: "Tahlil Listesi" }}
        />
        <Stack.Screen
          name="TahlilDetay"
          component={TahlilDetay}
          options={{ title: "Tahlil Detayı" }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profil Yönetimi" }}
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
    padding: 20,
    backgroundColor: "#f7f7f7", // Hafif gri bir arka plan
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0058a3", // Ana renk
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#0058a3", // Ana buton rengi
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000", // Hafif gölge efekti
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android için gölge efekti
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },  
});

export default App;
