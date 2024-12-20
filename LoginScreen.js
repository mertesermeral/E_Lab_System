// LoginScreen.js
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

const LoginScreen = () => {
  const [tc, setTc] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // TC kimlik numarasını email formatına çeviriyoruz
      const email = `${tc}@elab.com`;
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Giriş başarılı!");
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Giriş başarısız! TC veya şifre yanlış.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Laboratuvar Giriş</Text>
      <TextInput
        style={styles.input}
        placeholder="TC Kimlik Numarası"
        keyboardType="numeric"
        value={tc}
        onChangeText={setTc}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
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
});

export default LoginScreen;
