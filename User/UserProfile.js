import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { updatePassword, deleteUser } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; 
const UserProfile = () => {
  const [fullName, setFullName] = useState("");
  const [tcNumber, setTcNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [newPassword, setNewPassword] = useState(""); // Yeni şifre durumu
  const navigation = useNavigation(); // Navigation tanımı
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = auth.currentUser?.email;
        if (!userEmail) {
          Alert.alert("Hata", "Kullanıcı giriş yapmamış.");
          return;
        }

        const tc = userEmail.split("@")[0];
        setTcNumber(tc);

        const tahlilQuery = query(collection(db, "tahliller"), where("tcNumber", "==", tc));
        const tahlilSnapshot = await getDocs(tahlilQuery);

        if (!tahlilSnapshot.empty) {
          const tahlilData = tahlilSnapshot.docs[0].data();
          setFullName(tahlilData.fullName || "Ad Soyad Bilinmiyor");
          setGender(tahlilData.gender || "Bilinmiyor");
          setAge(tahlilData.age || "Bilinmiyor");
        } else {
          Alert.alert("Hata", "Kullanıcıya ait tahlil bulunamadı.");
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata:", error);
        Alert.alert("Hata", "Kullanıcı bilgileri alınırken bir hata oluştu.");
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordUpdate = async () => {
    if (!newPassword) {
      Alert.alert("Hata", "Yeni şifrenizi girin.");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi.");
      setNewPassword(""); // Şifre alanını temizle
    } catch (error) {
      Alert.alert("Hata", "Şifre güncellenirken bir hata oluştu.");
    }
  };

  const handleAccountDeletion = async () => {
    Alert.alert(
      "Hesabı Sil",
      "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
      [
        {
          text: "Hayır",
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              await deleteUser(auth.currentUser); // Kullanıcıyı Firebase Authentication'dan sil
              Alert.alert("Başarılı", "Hesabınız başarıyla silindi.");
              // Hesap silindikten sonra uygulamadan çıkış
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            } catch (error) {
              console.error("Hesap silinirken hata oluştu:", error);
              Alert.alert("Hata", "Hesap silinirken bir hata oluştu. Tekrar deneyin.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profil Yönetimi</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Ad Soyad:</Text>
        <Text style={styles.value}>{fullName}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>T.C. Kimlik Numarası:</Text>
        <Text style={styles.value}>{tcNumber}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Cinsiyet:</Text>
        <Text style={styles.value}>{gender}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Yaş (Ay):</Text>
        <Text style={styles.value}>{age}</Text>
      </View>

      <Text style={styles.title}>Şifre Değiştir</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Yeni Şifre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Yeni Şifre"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePasswordUpdate}>
        <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleAccountDeletion}>
        <Text style={styles.buttonText}>Hesabı Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0058a3",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#0058a3",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0058a3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
