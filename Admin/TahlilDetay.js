import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

// Serum değerini değerlendirme fonksiyonu
const evaluateSerumValue = (serumValue, min, max) => {
  if (serumValue < min) return "↓";
  if (serumValue > max) return "↑";
  return "↔";
};

const TahlilDetay = ({ route, navigation }) => {
  const { tahlilId } = route.params; // Tahlil için TC numarası parametre olarak geçiyor
  const [tahlilData, setTahlilData] = useState(null);
  const [guides, setGuides] = useState([]); // Kılavuzlar
  const [previousTahlils, setPreviousTahlils] = useState([]); // Önceki tahliller

  // Tahlil verisini Firebase'den alıyoruz
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

    const fetchGuides = async () => {
      try {
        const guidesRef = collection(db, "guides");
        const querySnapshot = await getDocs(guidesRef);
        const guidesData = [];

        querySnapshot.forEach((doc) => {
          guidesData.push({ guideName: doc.id, data: doc.data().data });
        });
        setGuides(guidesData);
      } catch (error) {
        console.error("Kılavuzlar alınırken hata oluştu:", error);
        Alert.alert("Hata", "Kılavuzlar alınırken bir hata oluştu.");
      }
    };

    fetchTahlilData();
    fetchGuides();
  }, [tahlilId]);

  useEffect(() => {
    const fetchPreviousTahlils = async () => {
      if (!tahlilData) return;

      try {
        const querySnapshot = await getDocs(collection(db, "tahliller"));
        const previousTahlils = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.tcNumber === tahlilData.tcNumber && // Aynı hastaya ait
            data.reportDate < tahlilData.reportDate // Daha önceki bir tarih
          ) {
            previousTahlils.push(data);
          }
        });

        // Tarihe göre sıralama (en yakın geçmişteki önce gelir)
        setPreviousTahlils(previousTahlils.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)));
      } catch (error) {
        console.error("Önceki tahliller alınırken hata oluştu:", error);
      }
    };

    fetchPreviousTahlils();
  }, [tahlilData]);

  // Yaş aralığına göre filtreleme
  const filterRowsByAge = (rows, age) => {
    return rows.filter((row) => {
      const [minAge, maxAge] = row.ageRange.split("-").map(Number);
      return age >= minAge && age <= maxAge;
    });
  };

  // Kılavuz değerlendirme
  const evaluateResults = (guides, serumValues, age) => {
    return guides.map((guide) => {
      const filteredRows = filterRowsByAge(guide.data, age);
  
      const guideResults = filteredRows.map((row) => {
        const evaluations = serumValues.map((serum) => {
          const { serumType, value } = serum;
  
          if (row.serumType === serumType) {
            const geoMeanEvaluation = isNaN(row.geoMeanMin) || isNaN(row.geoMeanMax)
              ? null
              : evaluateSerumValue(value, row.geoMeanMin, row.geoMeanMax);
  
            const arithMeanEvaluation = isNaN(row.arithMeanMin) || isNaN(row.arithMeanMax)
              ? null
              : evaluateSerumValue(value, row.arithMeanMin, row.arithMeanMax);
  
            const meanEvaluation = isNaN(row.meanMin) || isNaN(row.meanMax)
              ? null
              : evaluateSerumValue(value, row.meanMin, row.meanMax);
  
            const intervalEvaluation = isNaN(row.intervalMin) || isNaN(row.intervalMax)
              ? null
              : evaluateSerumValue(value, row.intervalMin, row.intervalMax);
            const minmaxEvaluation = isNaN(row.min) || isNaN(row.max)
              ? null
              : evaluateSerumValue(value, row.min, row.max);
  
            return {
              serumType,
              geoMean: geoMeanEvaluation ? `${row.geoMeanMin}-${row.geoMeanMax}` : null,
              geoMeanArrow: geoMeanEvaluation,
              arithMean: arithMeanEvaluation ? `${row.arithMeanMin}-${row.arithMeanMax}` : null,
              arithMeanArrow: arithMeanEvaluation,
              mean: meanEvaluation ? `${row.meanMin}-${row.meanMax}` : null,
              meanArrow: meanEvaluation,
              interval: intervalEvaluation ? `${row.intervalMin}-${row.intervalMax}` : null,
              intervalArrow: intervalEvaluation,
              minmax: minmaxEvaluation ? `${row.min}-${row.max}` : null,
              minmaxArrow: minmaxEvaluation,
            };
          }
  
          return null;
        }).filter(result => result !== null); // Geçerli olanları alıyoruz (NaN olmayan)
  
        return evaluations.length > 0 ? {
          guideName: guide.guideName,
          ageRange: row.ageRange,
          evaluations,
        } : null;
      }).filter(result => result !== null);
  
      return guideResults;
    }).flat();
  };

  const calculateChange = (currentValue, previousValue) => {
    if (currentValue > previousValue) return "↑";
    if (currentValue < previousValue) return "↓";
    return "↔";
  };

  const getArrowStyle = (arrow) => {
    switch (arrow) {
      case "↓":
        return { color: "green" }; // Düşük
      case "↑":
        return { color: "red" }; // Yüksek
      case "↔":
      default:
        return { color: "blue" }; // Aynı
    }
  };
   // Tahlil silme işlemi
   const handleDelete = async () => {
    try {
      const docRef = doc(db, "tahliller", tahlilId);
      await deleteDoc(docRef);
      Alert.alert("Başarılı", "Tahlil başarıyla silindi.");
      navigation.navigate("TahlilList"); // Silme işlemi sonrası geri git
    } catch (error) {
      console.error("Tahlil silinirken hata oluştu:", error);
      Alert.alert("Hata", "Tahlil silinirken bir hata oluştu.");
    }
  };
  const confirmDelete = () => { //tahlil silme onay kısmı
    Alert.alert(
      "Silme Onayı",
      "Bu tahlil verisini silmek istediğinizden emin misiniz?",
      [
        { text: "Hayır", style: "cancel" },
        { text: "Evet", onPress: handleDelete }
      ]
    );
  };

  if (!tahlilData || !guides.length) {
    return <Text>Yükleniyor...</Text>;
  }

  const serumValues = tahlilData.serumTypes.map((serum) => ({
    serumType: serum.type,
    value: serum.value,
  }));

  const evaluationResults = evaluateResults(guides, serumValues, tahlilData.age);

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

      <Text style={styles.label}>Serum Tipi ve Değerleri:</Text>
      {tahlilData.serumTypes.map((serum, index) => {
  // Serum tipi için en güncel bir önceki tahlili buluyoruz
          let previousValue = "N/A";
          
          for (let i = previousTahlils.length - 1; i >= 0; i--) {
            const prevSerum = previousTahlils[i].serumTypes.find((s) => s.type === serum.type);
            if (prevSerum) {
              previousValue = prevSerum.value;
              break;
            }
          }

          const changeArrow = previousValue !== "N/A" ? calculateChange(serum.value, previousValue) : "";

          return (
            <View key={index} style={styles.serumContainer}>
              <Text style={styles.serumText}>
                {serum.type}: {serum.value} mg/dl{" "}
                {changeArrow && <Text style={getArrowStyle(changeArrow)}>{changeArrow}</Text>}
              </Text>
              {previousValue !== "N/A" && <Text>Önceki Değer: {previousValue} mg/dl</Text>}
            </View>
          );
        })}
      <Text style={styles.label}>Kılavuzlara Göre Değerlendirmeler:</Text>
      {evaluationResults.map((result, index) => (
        <View key={index} style={styles.resultContainer}>
          <Text style={styles.guideName}>{result.guideName}</Text>
          <Text style={styles.ageRangeText}>Yaş Aralığı: {result.ageRange}</Text>
          {result.evaluations.map((evaluation, evalIndex) => (
            <View key={evalIndex} style={styles.evaluationContainer}>
              <Text style={styles.serumTypeText}>Serum Tipi: {evaluation.serumType}</Text>
              {evaluation.geoMean && (
                <Text>
                  GeoMean: {evaluation.geoMean}{" "}
                  <Text style={getArrowStyle(evaluation.geoMeanArrow)}>
                    {evaluation.geoMeanArrow}
                  </Text>
                </Text>
              )}
              {evaluation.arithMean && (
                <Text>
                  ArithMean: {evaluation.arithMean}{" "}
                  <Text style={getArrowStyle(evaluation.arithMeanArrow)}>
                    {evaluation.arithMeanArrow}
                  </Text>
                </Text>
              )}
              {evaluation.mean && (
                <Text>
                  Mean: {evaluation.mean}{" "}
                  <Text style={getArrowStyle(evaluation.meanArrow)}>
                    {evaluation.meanArrow}
                  </Text>
                </Text>
              )}
              {evaluation.minmax && (
                <Text>
                  Min-Max: {evaluation.minmax}{" "}
                  <Text style={getArrowStyle(evaluation.minmaxArrow)}>
                    {evaluation.minmaxArrow}
                  </Text>
                </Text>
              )}
              {evaluation.interval && (
                <Text>
                  Interval: {evaluation.interval}{" "}
                  <Text style={getArrowStyle(evaluation.intervalArrow)}>
                    {evaluation.intervalArrow}
                  </Text>
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.ButtonText}>Tahlili Sil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.ButtonText}>Geri Dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: "#fff",
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
  resultContainer: {
    marginVertical: 15,
  },
  guideName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  ageRangeText: {
    fontSize: 16,
    marginVertical: 5,
  },
  evaluationContainer: {
    marginVertical: 5,
  },
  serumTypeText: {
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  ButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default TahlilDetay;
