import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Eğer giriş başarılıysa, admin paneline yönlendirebiliriz
      Alert.alert("Başarılı", "Admin olarak giriş yaptınız!");
      navigation.navigate("AdminDashboard"); // Admin paneline yönlendirme (admin ekranı eklemeniz gerekebilir)
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Giriş başarısız! E-posta veya şifre yanlış.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Girişi</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => navigation.navigate("UserLogin")} // Kullanıcı girişine yönlendirme
      >
        <Text style={styles.switchButtonText}>Kullanıcı Girişi</Text>
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
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 10,
  },
  switchButtonText: {
    color: "#6200ee",
    fontSize: 16,
  },
});

export default AdminLoginScreen;
