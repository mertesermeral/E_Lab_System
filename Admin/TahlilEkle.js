import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Doğru modülden Picker
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const TahlilEkle = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    tcNumber: "",
    birthDate: "",
    age: "",
    gender: "",
    birthPlace: "",
    patientNumber: "",
    protocolNumber: "",
    patientType: "Yatan",
    sampleType: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculateAge = () => {
    const birthDate = new Date(formData.birthDate);
    const currentDate = new Date();
    const diffInMonths =
      (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      birthDate.getMonth();
    return diffInMonths;
  };

  const handleSave = async () => {
    const ageInMonths = calculateAge();
    if (!formData.fullName || !formData.tcNumber || formData.tcNumber.length !== 11) {
      Alert.alert("Hata", "Lütfen tüm bilgileri doğru şekilde doldurun!");
      return;
    }

    const tahlilData = {
      ...formData,
      age: ageInMonths,
    };

    try {
      const docRef = doc(db, "tahliller", formData.tcNumber);
      await setDoc(docRef, tahlilData);
      Alert.alert("Başarılı", "Tahlil başarıyla kaydedildi!");
      setFormData({
        fullName: "",
        tcNumber: "",
        birthDate: "",
        age: "",
        gender: "",
        birthPlace: "",
        patientNumber: "",
        protocolNumber: "",
        patientType: "Yatan",
        sampleType: "",
      });
    } catch (error) {
      console.error("Tahlil kaydedilemedi:", error);
      Alert.alert("Hata", "Tahlil kaydedilirken bir hata oluştu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tahlil Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Adı Soyadı"
        value={formData.fullName}
        onChangeText={(value) => handleInputChange("fullName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="T.C. Kimlik No"
        keyboardType="numeric"
        value={formData.tcNumber}
        onChangeText={(value) => handleInputChange("tcNumber", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Doğum Tarihi (YYYY-MM-DD)"
        value={formData.birthDate}
        onChangeText={(value) => handleInputChange("birthDate", value)}
      />
      <Picker
        selectedValue={formData.gender}
        onValueChange={(value) => handleInputChange("gender", value)}
        style={styles.input}
      >
        <Picker.Item label="Cinsiyet Seçin" value="" />
        <Picker.Item label="Erkek" value="Erkek" />
        <Picker.Item label="Kadın" value="Kadın" />
      </Picker>
      <Button title="Kaydet" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },
});

export default TahlilEkle;
