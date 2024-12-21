import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const Kilavuz = () => {
  const [guideName, setGuideName] = useState("");
  const [rows, setRows] = useState([]);

  const handleInputChange = (index, name, value) => {
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, ageRange: "", geoMean: "", mean: "", min: "", max: "", interval: "" },
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSave = async () => {
    if (!guideName) {
      Alert.alert("Uyarı", "Lütfen bir kılavuz adı girin!");
      return;
    }
    if (rows.length === 0) {
      Alert.alert("Uyarı", "Lütfen en az bir satır ekleyin!");
      return;
    }

    const formattedRows = rows.map((row) => ({
      ageRange: row.ageRange,
      geoMeanMin: parseFloat(row.geoMean) - parseFloat(row.interval),
      geoMeanMax: parseFloat(row.geoMean) + parseFloat(row.interval),
      mean: parseFloat(row.mean),
      min: parseFloat(row.min),
      max: parseFloat(row.max),
    }));

    try {
      await setDoc(doc(db, "guides", guideName), { data: formattedRows });
      Alert.alert("Başarılı", "Kılavuz başarıyla oluşturuldu!");
      setGuideName("");
      setRows([]);
    } catch (error) {
      console.error("Veri kaydedilemedi: ", error);
      Alert.alert("Hata", "Kılavuz oluşturulurken bir hata oluştu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Oluştur</Text>
      <TextInput
        style={styles.input}
        placeholder="Kılavuz Adı"
        value={guideName}
        onChangeText={setGuideName}
      />
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Yaş Aralığı (ay)"
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
              placeholder="Mean"
              keyboardType="numeric"
              value={item.mean}
              onChangeText={(value) => handleInputChange(index, "mean", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              value={item.min}
              onChangeText={(value) => handleInputChange(index, "min", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Max"
              keyboardType="numeric"
              value={item.max}
              onChangeText={(value) => handleInputChange(index, "max", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Interval (SD)"
              keyboardType="numeric"
              value={item.interval}
              onChangeText={(value) => handleInputChange(index, "interval", value)}
            />
            <Button title="Sil" color="red" onPress={() => deleteRow(item.id)} />
          </View>
        )}
      />
      <Button title="Satır Ekle" onPress={addRow} />
      <Button title="Kılavuz Oluştur" onPress={handleSave} />
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
    width: "100%",
  },
  row: {
    flexDirection: "column",
    marginBottom: 15,
  },
});

export default Kilavuz;
