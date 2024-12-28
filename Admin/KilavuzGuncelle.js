import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const KilavuzGuncelle = ({ route, navigation }) => {
  const { guideId } = route.params;
  const [newRow, setNewRow] = useState({
    ageRange: "",
    geoMeanMin: "",
    geoMeanMax: "",
    meanMin: "",
    meanMax: "",
    arithMeanMin: "",
    arithMeanMax: "",
    min: "",
    max: "",
    intervalMin: "",
    intervalMax: "",
    serumType: "",
  });

  const handleInputChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  const handleAddRow = async () => {
    try {
      // Firebase'den mevcut kılavuzu çek
      const docRef = doc(db, "guides", guideId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data().data || [];

        // Yeni satırı oluştur
        const formattedRow = {
          ...newRow,
          geoMeanMin: newRow.geoMeanMin ? parseFloat(newRow.geoMeanMin) : NaN,
          geoMeanMax: newRow.geoMeanMax ? parseFloat(newRow.geoMeanMax) : NaN,
          meanMin: newRow.meanMin ? parseFloat(newRow.meanMin) : NaN,
          meanMax: newRow.meanMax ? parseFloat(newRow.meanMax) : NaN,
          arithMeanMin: newRow.arithMeanMin ? parseFloat(newRow.arithMeanMin) : NaN,
          arithMeanMax: newRow.arithMeanMax ? parseFloat(newRow.arithMeanMax) : NaN,
          intervalMin: newRow.intervalMin ? parseFloat(newRow.intervalMin) : NaN,
          intervalMax: newRow.intervalMax ? parseFloat(newRow.intervalMax) : NaN,
          min: newRow.min ? parseFloat(newRow.min) : NaN,
          max: newRow.max ? parseFloat(newRow.max) : NaN,
        };

        // Mevcut verilere yeni satırı ekle
        const updatedData = [...existingData, formattedRow];

        // Firestore'da güncelle
        await updateDoc(docRef, { data: updatedData });

        Alert.alert("Başarılı", "Yeni satır başarıyla eklendi!");
        navigation.navigate("KilavuzTablosu", { guideId: guideId });
      } else {
        Alert.alert("Hata", "Kılavuz bulunamadı!");
      }
    } catch (error) {
      console.error("Satır eklenirken hata oluştu: ", error);
      Alert.alert("Hata", "Satır eklenirken bir hata oluştu!");
    }
  };

  return (
     <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Yeni Satır Ekle</Text>

      <Text style={styles.inputLabel}>Yaş (Ay)</Text>
      <TextInput
        style={styles.input}
        value={newRow.ageRange}
        onChangeText={(value) => handleInputChange("ageRange", value)}
      />

      <Text style={styles.inputLabel}>Geo Mean Min</Text>
      <TextInput
        style={styles.input}
        value={newRow.geoMeanMin}
        onChangeText={(value) => handleInputChange("geoMeanMin", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Geo Mean Max</Text>
      <TextInput
        style={styles.input}
        value={newRow.geoMeanMax}
        onChangeText={(value) => handleInputChange("geoMeanMax", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Mean Min</Text>
      <TextInput
        style={styles.input}
        value={newRow.meanMin}
        onChangeText={(value) => handleInputChange("meanMin", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Mean Max</Text>
      <TextInput
        style={styles.input}
        value={newRow.meanMax}
        onChangeText={(value) => handleInputChange("meanMax", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Arith Mean Min</Text>
      <TextInput
        style={styles.input}
        value={newRow.arithMeanMin}
        onChangeText={(value) => handleInputChange("arithMeanMin", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Arith Mean Max</Text>
      <TextInput
        style={styles.input}
        value={newRow.arithMeanMax}
        onChangeText={(value) => handleInputChange("arithMeanMax", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Min</Text>
      <TextInput
        style={styles.input}
        value={newRow.min}
        onChangeText={(value) => handleInputChange("min", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Max</Text>
      <TextInput
        style={styles.input}
        value={newRow.max}
        onChangeText={(value) => handleInputChange("max", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>%95 Confidence Interval Min</Text>
      <TextInput
        style={styles.input}
        value={newRow.intervalMin}
        onChangeText={(value) => handleInputChange("intervalMin", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>%95 Confidence Interval Max</Text>
      <TextInput
        style={styles.input}
        value={newRow.intervalMax}
        onChangeText={(value) => handleInputChange("intervalMax", value)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Serum Tipi</Text>
      <TextInput
        style={styles.input}
        value={newRow.serumType}
        onChangeText={(value) => handleInputChange("serumType", value)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleAddRow}>
        <Text style={styles.saveButtonText}>Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30, // Kaydet butonunun altının görünmesini sağlar
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default KilavuzGuncelle;
