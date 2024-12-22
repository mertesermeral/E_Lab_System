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
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Firestore bağlantısı kontrol edin

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    try {
      // Kullanıcı girişi yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Giriş yapan kullanıcının UID'sini al

      // Kullanıcı rolünü Firestore'dan kontrol et
      const docRef = doc(db, "roles", uid); // UID ile "roles" koleksiyonundan belge al
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === "admin") {
        // Admin rolüne sahipse admin paneline yönlendir
        Alert.alert("Başarılı", "Admin olarak giriş yaptınız!");
        navigation.navigate("AdminDashboard"); // Admin paneline yönlendirme
      } else {
        // Admin rolüne sahip değilse hata göster
        Alert.alert("Hata", "Bu kullanıcı admin yetkisine sahip değil!");
      }
    } catch (error) {
      console.error("Admin giriş hatası:", error);
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
