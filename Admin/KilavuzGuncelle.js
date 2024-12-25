import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const KilavuzGuncelle = ({ route, navigation }) => {
  const { guideId } = route.params;
  const [guideData, setGuideData] = useState([]);
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

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const docRef = doc(db, "guides", guideId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuideData(docSnap.data().data || []);
        } else {
          Alert.alert("Hata", "Kılavuz bulunamadı!");
        }
      } catch (error) {
        console.error("Kılavuz çekilemedi: ", error);
      }
    };

    fetchGuide();
  }, [guideId]);

  const handleInputChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  const handleAddRow = async () => {
    const updatedData = [...guideData, newRow];
    try {
      const docRef = doc(db, "guides", guideId);
      await updateDoc(docRef, { data: updatedData });
      setGuideData(updatedData);
      Alert.alert("Başarılı", "Yeni satır başarıyla eklendi!");
      navigation.goBack();
    } catch (error) {
      console.error("Satır eklenemedi: ", error);
      Alert.alert("Hata", "Satır eklenirken bir hata oluştu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Güncelle: {guideId}</Text>
      <TextInput
        style={styles.input}
        placeholder="Yaş Aralığı (Ay)"
        value={newRow.ageRange}
        onChangeText={(value) => handleInputChange("ageRange", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Geo Mean Min"
        value={newRow.geoMeanMin}
        onChangeText={(value) => handleInputChange("geoMeanMin", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Geo Mean Max"
        value={newRow.geoMeanMax}
        onChangeText={(value) => handleInputChange("geoMeanMax", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mean Min"
        value={newRow.meanMin}
        onChangeText={(value) => handleInputChange("meanMin", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mean Max"
        value={newRow.meanMax}
        onChangeText={(value) => handleInputChange("meanMax", value)}
      />
      <Button title="Satır Ekle" onPress={handleAddRow} />
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
});

export default KilavuzGuncelle;
