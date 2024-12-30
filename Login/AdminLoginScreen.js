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
import { auth, db } from "../firebase"; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
        navigation.reset({
          index: 0,
          routes: [{ name: "AdminDashboard" }], 
        }); // Admin paneline yönlendirme
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
      <Text style={styles.title}>Doktor Girişi</Text>
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
        <Text style={styles.buttonText}>Giriş Yap </Text><MaterialCommunityIcons name="login" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("UserLogin")} // Kullanıcı girişine yönlendirme
      >
        <Text style={styles.buttonText}>Hasta Girişi</Text>
        <MaterialCommunityIcons name="emoticon-sick-outline" size={24} color="white" />
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

export default AdminLoginScreen;
