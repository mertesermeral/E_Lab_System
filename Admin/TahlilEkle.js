import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const TahlilEkle = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    tcNumber: "",
    birthDate: null,
    age: 0,
    gender: "",
    patientType: "",
    sampleType: "",
    serumTypes: [],  // Serum tiplerini burada saklıyoruz
  });

  const [newSerumType, setNewSerumType] = useState("");  // Seçilen serum tipi
  const [newSerumValue, setNewSerumValue] = useState("");  // Serum değeri

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSerumValue = () => {
    if (!newSerumType || !newSerumValue) {
      Alert.alert("Hata", "Lütfen serum tipi ve değeri girin!");
      return;
    }

    const newSerum = { type: newSerumType, value: newSerumValue };
    setFormData((prevData) => ({
      ...prevData,
      serumTypes: [...prevData.serumTypes, newSerum],
    }));

    // Temizle
    setNewSerumType("");
    setNewSerumValue("");
  };

  const calculateAgeInMonths = (birthDate) => {
    const currentDate = new Date();
    let ageInMonths = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
                       currentDate.getMonth() - birthDate.getMonth();

    if (currentDate.getDate() < birthDate.getDate()) {
      ageInMonths--;
    }

    return ageInMonths < 0 ? 0 : ageInMonths;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
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
    if (!formData.fullName.length || formData.tcNumber.length === 0) {
      showAlert("Hata", "Lütfen tüm bilgileri doğru şekilde doldurun!");
      return;
    }

    try {
      const currentDate = new Date().toLocaleString("tr-TR", {timeZone: "Europe/Istanbul"});
      const docRef = doc(db, "tahliller", `${formData.tcNumber}_${new Date().toLocaleString("tr-TR", {timeZone: "Europe/Istanbul"})}`);
      const adjustedDate = new Date(
        formData.birthDate.getFullYear(),
        formData.birthDate.getMonth(),
        formData.birthDate.getDate()
      );

      await setDoc(docRef, {
        ...formData,
        birthDate: adjustedDate,
        reportDate: currentDate,
      });

      showAlert("Başarılı", "Tahlil başarıyla kaydedildi!");
      setFormData({
        fullName: "",
        tcNumber: "",
        birthDate: null,
        age: 0,
        gender: "",
        patientType: "",
        sampleType: "",
        serumTypes: [],  // Formu sıfırlıyoruz
      });
    } catch (error) {
      console.error("Tahlil kaydedilemedi:", error);
      showAlert("Hata", "Tahlil kaydedilirken bir hata oluştu!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Tahlil Ekle</Text>
        <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholder="Adı Soyadı"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange("fullName", value)}
        />
        </View>
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
            maximumDate={new Date()}
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
        <Picker
          selectedValue={formData.patientType}
          onValueChange={(value) => handleInputChange("patientType", value)}
          style={styles.input}
        >
          <Picker.Item label="Hasta Türü" value="" />
          <Picker.Item label="Yatan Hasta" value="Yatan Hasta" />
          <Picker.Item label="Ayakta Hasta" value="Ayakta Hasta" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Numune Türü"
          value={formData.sampleType}
          onChangeText={(value) => handleInputChange("sampleType", value)}
        />

        <Text style={styles.ageDisplay}>Tetkik Adı (mg/dl)</Text>
        <Picker
          selectedValue={newSerumType}
          onValueChange={(itemValue) => setNewSerumType(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Serum Tipi Seçin" value="" />
          <Picker.Item label="IgG" value="IgG" />
          <Picker.Item label="IgG1" value="IgG1" />
          <Picker.Item label="IgG2" value="IgG2" />
          <Picker.Item label="IgG3" value="IgG3" />
          <Picker.Item label="IgG4" value="IgG4" />
          <Picker.Item label="IgA" value="IgA" />
          <Picker.Item label="IgA1" value="IgA1" />
          <Picker.Item label="IgA2" value="IgA2" />
          <Picker.Item label="IgM" value="IgM" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Serum Değeri"
          value={newSerumValue}
          keyboardType="numeric"
          onChangeText={(value) => setNewSerumValue(value)}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddSerumValue}>
          <Text style={styles.ButtonText}>Serum Değeri Ekle</Text>
        </TouchableOpacity>

        {formData.serumTypes.length > 0 && (
          <View style={styles.serumList}>
            {formData.serumTypes.map((serum, index) => (
              <Text key={index} style={styles.serumItem}>
                {serum.type}: {serum.value}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.ButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30, // Kaydet butonunun altının görünmesini sağlar
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0058a3", // Ana başlık rengi
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
  addButton: {
    width: "100%",
    backgroundColor: "#0058a3", // Ana buton rengi
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: 15,
  },
  ButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  serumList: {
    marginTop: 20,
  },
  serumItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TahlilEkle;
