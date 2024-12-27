import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const TahlilDetay = ({ route, navigation }) => {
  const { tahlilId } = route.params; // Tahlil için TC numarası parametre olarak geçiyor

  const [tahlilData, setTahlilData] = useState(null);

  useEffect(() => {
    const fetchTahlilData = async () => {
      try {
        const docRef = doc(db, "tahliller", tahlilId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTahlilData(docSnap.data());
        } else {
          Alert.alert("Hata", "Bu tahlil verisi bulunamadı.");
        }
      } catch (error) {
        console.error("Tahlil verisi alınırken hata oluştu:", error);
        Alert.alert("Hata", "Tahlil verisi alınırken bir hata oluştu.");
      }
    };

    fetchTahlilData();
  }, [tahlilId]);

  if (!tahlilData) {
    return <Text>Yükleniyor...</Text>; // Veri yüklenirken basit bir mesaj
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Tahlil Detayı</Text>

      <Text style={styles.label}>Adı Soyadı:</Text>
      <Text style={styles.value}>{tahlilData.fullName}</Text>

      <Text style={styles.label}>T.C. Kimlik No:</Text>
      <Text style={styles.value}>{tahlilData.tcNumber}</Text>

      <Text style={styles.label}>Yaş (Ay):</Text>
      <Text style={styles.value}>{tahlilData.age}</Text>

      <Text style={styles.label}>Cinsiyet:</Text>
      <Text style={styles.value}>{tahlilData.gender}</Text>

      <Text style={styles.label}>Hasta Türü:</Text>
      <Text style={styles.value}>{tahlilData.patientType}</Text>

      <Text style={styles.label}>Numune Türü:</Text>
      <Text style={styles.value}>{tahlilData.sampleType}</Text>

      <Text style={styles.label}>Serum Tipi ve Değerleri:</Text>
      {tahlilData.serumTypes.length > 0 ? (
        tahlilData.serumTypes.map((serum, index) => (
          <View key={index} style={styles.serumContainer}>
            <Text style={styles.serumText}>
              {serum.type}: {serum.value} mg/dl
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>Serum bilgisi bulunmamaktadır.</Text>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  serumContainer: {
    marginVertical: 5,
  },
  serumText: {
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default TahlilDetay;
