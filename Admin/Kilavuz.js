import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Picker bileşeni
import { db } from "../firebase";
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
      {
        id: rows.length + 1,
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
      },
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const validateInputs = () => {
    if (!guideName.trim()) {
      Alert.alert("Uyarı", "Lütfen bir kılavuz adı girin!");
      return false;
    }
    if (rows.length === 0) {
      Alert.alert("Uyarı", "Lütfen en az bir satır ekleyin!");
      return false;
    }
   
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    const formatNumber = (num, precision) => {
        const factor = Math.pow(10, precision); // Virgülden sonraki basamağa kadar olan sayıyı elde etmek için çarpan
        return Math.floor(num * factor) / factor; // Sayıyı çarpıp kesip sonra bölerek virgülden sonrası alınır
    };

    const formattedRows = rows.map((row) => ({
        ageRange: row.ageRange,
        geoMeanMin: formatNumber(parseFloat(row.geoMean) - parseFloat(row.gSD), 2), // GeoMean - GSD
        geoMeanMax: formatNumber(parseFloat(row.geoMean) + parseFloat(row.gSD), 2), // GeoMean + GSD
        meanMin: formatNumber(parseFloat(row.mean) - parseFloat(row.mSD), 2), // Mean - MSD
        meanMax: formatNumber(parseFloat(row.mean) + parseFloat(row.mSD), 2), // Mean + MSD
        min: formatNumber(parseFloat(row.min), 2), // Min değerini kes
        max: formatNumber(parseFloat(row.max), 2), // Max değerini kes
        intervalMin: formatNumber(parseFloat(row.intervalMin), 2), // Interval Min değerini kes
        intervalMax: formatNumber(parseFloat(row.intervalMax), 2), // Interval Max değerini kes
        serumType: row.serumType, 
        arithMeanMin: formatNumber(parseFloat(row.arithMean) - parseFloat(row.arithSD), 2), // ArithMean - ArithSD
        arithMeanMax: formatNumber(parseFloat(row.arithMean) + parseFloat(row.arithSD), 2), // ArithMean + ArithSD
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
              onChangeText={(value) =>
                handleInputChange(index, "ageRange", value)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Geometric Mean"
              keyboardType="numeric"
              value={item.geoMean}
              onChangeText={(value) =>
                handleInputChange(index, "geoMean", value)
              }
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
              placeholder="Interval Min"
              keyboardType="numeric"
              value={item.intervalMin}
              onChangeText={(value) =>
                handleInputChange(index, "intervalMin", value)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Interval Max"
              keyboardType="numeric"
              value={item.intervalMax}
              onChangeText={(value) =>
                handleInputChange(index, "intervalMax", value)
              }
            />
            <Picker
              selectedValue={item.serumType}
              style={styles.picker}
              onValueChange={(value) =>
                handleInputChange(index, "serumType", value)
              }
            >
              <Picker.Item label="Serum Type (mg/dl)" value="" enabled={false}/>
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
              placeholder="Aritmetik Ort."
              keyboardType="numeric"
              value={item.arithMean}
              onChangeText={(value) =>
                handleInputChange(index, "arithMean", value)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="SS"
              keyboardType="numeric"
              value={item.arithSD}
              onChangeText={(value) =>
                handleInputChange(index, "arithSD", value)
              }
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRow(item.id)}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={addRow}>
        <Text style={styles.addButtonText}>Satır Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kılavuz Oluştur</Text>
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
  row: {
    flexDirection: "column",
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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

export default Kilavuz;
