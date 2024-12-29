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
import { auth } from "../firebase";

const LoginScreen = ({navigation}) => {
  const [tc, setTc] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Kayıt yapılıp yapılmadığını kontrol eden durum

  const handleLogin = async () => {
    try {
      const email = `${tc}@elab.com`; // TC kimlik numarasını email formatına çeviriyoruz
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Giriş başarılı!");
      navigation.navigate("UserTahlilList"); // Kullanıcı için yönlendirme
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
        maxLength={11}
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
    padding: 20,
    backgroundColor: "#f7f7f7", // Açık gri arka plan
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100, // Eğer bir logo kullanılacaksa
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0058a3", // Ana renk
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#0058a3", // Ana buton rengi
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
  link: {
    marginTop: 15,
  },
  linkText: {
    color: "#0058a3", // Link rengi
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#dc143c", // Uyarı rengi
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
});

export default LoginScreen;