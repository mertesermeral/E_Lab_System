import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const TahlilEkle = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    tcNumber: "",
    birthDate: null,
    age: 0,  // Yaş başlangıç değeri 0 olmalı
    gender: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculateAgeInMonths = (birthDate) => {
    const currentDate = new Date();
  
    // Yıl farkı hesaplanıyor
    let ageInMonths = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
                       currentDate.getMonth() - birthDate.getMonth();
  
    // Eğer ay farkı negatifse, yani bu yıl doğum günü henüz gelmediyse, bir ay eksilt.
    if (currentDate.getDate() < birthDate.getDate()) {
      ageInMonths--;
    }
  
    // Eğer yaş 0 aylık veya daha azsa, 0 aylık kabul edelim
    return ageInMonths < 0 ? 0 : ageInMonths;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Sadece tarihi al, saat bilgisi eklenmesin
      const adjustedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const ageInMonths = calculateAgeInMonths(adjustedDate);
      setFormData({ ...formData, birthDate: adjustedDate, age: ageInMonths });
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const showAlert = (title, message) => Alert.alert(title, message);

  const handleSave = async () => {
    if (!formData.fullName.length || formData.tcNumber.length == 0) {
      showAlert("Hata", "Lütfen tüm bilgileri doğru şekilde doldurun!");
      return;
    }

    try {
      const docRef = doc(db, "tahliller", formData.tcNumber);
      // Sadece tarih kısmını al, saat bilgisini sıfırla
      const adjustedDate = new Date(
        formData.birthDate.getFullYear(),
        formData.birthDate.getMonth(),
        formData.birthDate.getDate()
      );

      await setDoc(docRef, {
        ...formData,
        birthDate: adjustedDate, // Sadece tarih kaydedilir
      });

      showAlert("Başarılı", "Tahlil başarıyla kaydedildi!");
      setFormData({
        fullName: "",
        tcNumber: "",
        birthDate: null,
        age: 0,
        gender: "",
      });
    } catch (error) {
      console.error("Tahlil kaydedilemedi:", error);
      showAlert("Hata", "Tahlil kaydedilirken bir hata oluştu!");
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
        maxLength={11}
        placeholder="T.C. Kimlik No"
        keyboardType="numeric"
        value={formData.tcNumber}
        onChangeText={(value) => handleInputChange("tcNumber", value)}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={styles.datePickerText}>
          {formData.birthDate ? formatDate(formData.birthDate) : "Doğum Tarihi Seçin"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()} // Gelecek tarih seçimi engelleniyor
        />
      )}

      <Text style={styles.ageDisplay}>Yaş (Ay): {formData.age}</Text>

      <Picker
        selectedValue={formData.gender}
        onValueChange={(value) => handleInputChange("gender", value)}
        style={styles.input}
      >
        <Picker.Item label="Cinsiyet Seçin" value="" />
        <Picker.Item label="Erkek" value="Erkek" />
        <Picker.Item label="Kadın" value="Kadın" />
      </Picker>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerText: {
    color: "#555",
  },
  ageDisplay: {
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: 15,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default TahlilEkle;
