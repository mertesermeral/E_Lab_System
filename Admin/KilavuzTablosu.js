import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const GuideTable = ({ route, navigation }) => {
  const { guideId } = route.params;
  const [guideData, setGuideData] = useState([]);

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

  const handleInputChange = (index, field, value) => {
    const updatedData = [...guideData];
    updatedData[index][field] = value;
    setGuideData(updatedData);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "guides", guideId);
      await updateDoc(docRef, { data: guideData });
      Alert.alert("Başarılı", "Kılavuz başarıyla güncellendi!");
    } catch (error) {
      console.error("Kılavuz güncellenemedi: ", error);
      Alert.alert("Hata", "Kılavuz güncellenirken bir hata oluştu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{guideId} Kılavuzu</Text>
      <FlatList
        data={guideData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Yaş Aralığı"
              value={item.ageRange}
              onChangeText={(value) => handleInputChange(index, "ageRange", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Geo Mean"
              value={item.geoMean}
              onChangeText={(value) => handleInputChange(index, "geoMean", value)}
            />
            {/* Diğer sütunlar burada... */}
          </View>
        )}
      />
      <Button title="Kaydet" onPress={handleSave} />
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
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    flex: 1,
  },
});

export default GuideTable;
