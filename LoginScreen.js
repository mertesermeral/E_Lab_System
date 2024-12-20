import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const LoginScreen = () => {
  const [tc, setTc] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Kayıt yapılıp yapılmadığını kontrol eden durum

  const handleLogin = async () => {
    try {
      const email = `${tc}@elab.com`; // TC kimlik numarasını email formatına çeviriyoruz
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Giriş başarılı!");
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Giriş başarısız! TC veya şifre yanlış.");
    }
  };

  const handleRegister = async () => {
    try {
      const email = `${tc}@elab.com`; // TC kimlik numarasını email formatına çeviriyoruz
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Kayıt başarılı!");
      setIsRegistering(false); // Kayıt işlemi sonrası giriş ekranına dön
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Kayıt başarısız! Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "E-Laboratuvar Kayıt" : "E-Laboratuvar Giriş"}</Text>
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
      <TouchableOpacity style={styles.button} onPress={isRegistering ? handleRegister : handleLogin}>
        <Text style={styles.buttonText}>{isRegistering ? "Kayıt Ol" : "Giriş Yap"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsRegistering(!isRegistering)} // Kayıt ve giriş ekranı arasında geçiş yapar
      >
        <Text style={styles.switchButtonText}>
          {isRegistering ? "Zaten bir hesabınız var mı? Giriş yapın." : "Hesabınız yok mu? Kayıt olun."}
        </Text>
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

export default LoginScreen;