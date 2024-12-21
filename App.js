import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminLoginScreen from "./AdminLoginScreen";
import UserLoginScreen from "./UserLoginScreen";
import AdminDashboard from "./AdminDashboard";
import Kilavuz from "./Kilavuz"; 

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
