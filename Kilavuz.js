import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const Kilavuz = ({ navigation }) => {
  const [ageRange, setAgeRange] = useState("");
  const [IgALow, setIgALow] = useState("");
  const [IgAHigh, setIgAHigh] = useState("");

  const handleCreateGuide = async () => {
    if (!ageRange || !IgALow || !IgAHigh) {
      Alert.alert("Hata", "Tüm alanları doldurun!");
      return;
    }

    try {
      await addDoc(collection(db, "guides"), {
        ageRange,
        testLimits: {
          IgA: { low: parseFloat(IgALow), high: parseFloat(IgAHigh) },
        },
      });
      Alert.alert("Başarılı", "Kılavuz başarıyla oluşturuldu!");
      navigation.goBack(); // Admin Dashboard'a geri dön
    } catch (error) {
      console.error("Kılavuz oluşturma hatası:", error);
      Alert.alert("Hata", "Kılavuz oluşturulamadı.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Oluştur</Text>
      <TextInput
        style={styles.input}
        placeholder="Yaş Aralığı (örn: 18-25)"
        value={ageRange}
        onChangeText={setAgeRange}
      />
      <TextInput
        style={styles.input}
        placeholder="IgA Düşük Limit"
        value={IgALow}
        onChangeText={setIgALow}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgA Yüksek Limit"
        value={IgAHigh}
        onChangeText={setIgAHigh}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateGuide}>
        <Text style={styles.buttonText}>Oluştur</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    width: "100%",
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

export default Kilavuz;
