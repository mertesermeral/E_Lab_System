import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const KilavuzGuncelle = ({ route, navigation }) => {
  const { guideId } = route.params;
  const [guideData, setGuideData] = useState([]);
  const [newRow, setNewRow] = useState({
    ageRange: "",
    geoMean: "",
    gSD: "",
    mean: "",
    mSD: "",
    min: "",
    max: "",
    intervalMin: "",
    intervalMax: "",
    serumType: "",
    arithMean: "",
    arithSD: "",
  });

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const docRef = doc(db, "guides", guideId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuideData(docSnap.data().data || []);
          console.log("Kılavuz verileri yüklendi!");
        } else {
          Alert.alert("Hata", "Kılavuz bulunamadı!");
        }
      } catch (error) {
        console.error("Kılavuz çekilemedi: ", error);
      }
    };

    fetchGuide();
  }, [guideId]);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...guideData];
    updatedData[index][field] = value;
    setGuideData(updatedData);
  };

  const handleAddRow = async () => {
    const updatedData = [...guideData, newRow];
    try {
      const docRef = doc(db, "guides", guideId);
      await updateDoc(docRef, { data: updatedData });
      setGuideData(updatedData);
      setNewRow({
        ageRange: "",
        geoMean: "",
        gSD: "",
        mean: "",
        mSD: "",
        min: "",
        max: "",
        intervalMin: "",
        intervalMax: "",
        serumType: "",
        arithMean: "",
        arithSD: "",
      });
      Alert.alert("Başarılı", "Yeni satır başarıyla eklendi!");
    } catch (error) {
      console.error("Satır eklenemedi: ", error);
      Alert.alert("Hata", "Satır eklenirken bir hata oluştu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Güncelle: {guideId}</Text>

      <FlatList
        data={guideData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Yaş Aralığı (Ay)"
              value={item.ageRange}
              onChangeText={(value) => handleInputChange(index, "ageRange", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Geometric Mean"
              keyboardType="numeric"
              value={item.geoMean}
              onChangeText={(value) => handleInputChange(index, "geoMean", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="SD (Geometric Mean)"
              keyboardType="numeric"
              value={item.gSD}
              onChangeText={(value) => handleInputChange(index, "gSD", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mean"
              keyboardType="numeric"
              value={item.mean}
              onChangeText={(value) => handleInputChange(index, "mean", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="SD (Mean)"
              keyboardType="numeric"
              value={item.mSD}
              onChangeText={(value) => handleInputChange(index, "mSD", value)}
            />
            <Picker
              selectedValue={item.serumType}
              style={styles.picker}
              onValueChange={(value) => handleInputChange(index, "serumType", value)}
            >
              <Picker.Item label="Serum Type (mg/dl)" value="" enabled={false} />
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
          </View>
        )}
      />

      <Button title="Yeni Satır Ekle" onPress={handleAddRow} />
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
  row: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default KilavuzGuncelle;
