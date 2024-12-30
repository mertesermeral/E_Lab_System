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
  const { tahlilId } = route.params;
  const [tahlilData, setTahlilData] = useState(null);
  const [guides, setGuides] = useState([]);
  const [previousTahlils, setPreviousTahlils] = useState([]);

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
            data.tcNumber === tahlilData.tcNumber &&
            data.reportDate < tahlilData.reportDate
          ) {
            previousTahlils.push(data);
          }
        });

        setPreviousTahlils(previousTahlils.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)));
      } catch (error) {
        console.error("Önceki tahliller alınırken hata oluştu:", error);
      }
    };

    fetchPreviousTahlils();
  }, [tahlilData]);

  const filterRowsByAge = (rows, age) => {
    return rows.filter((row) => {
      const [minAge, maxAge] = row.ageRange.split("-").map((value) =>
        value === "" ? null : Number(value)
      );

      if (minAge !== null && maxAge !== null) {
        return age >= minAge && age <= maxAge;
      } else if (minAge !== null) {
        return age >= minAge;
      } else if (maxAge !== null) {
        return age <= maxAge;
      }

      return false;
    });
  };

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
        }).filter(result => result !== null);

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
        return { color: "green",fontWeight: "bold",fontSize:"20"};
      case "↑":
        return { color: "red",fontWeight: "bold",fontSize:"20"};
      case "↔":
      default:
        return { color: "blue",fontWeight: "bold",fontSize:"20"};
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "tahliller", tahlilId);
      await deleteDoc(docRef);
      Alert.alert("Başarılı", "Tahlil başarıyla silindi.");
      navigation.goBack();
    } catch (error) {
      console.error("Tahlil silinirken hata oluştu:", error);
      Alert.alert("Hata", "Tahlil silinirken bir hata oluştu.");
    }
  };

  const confirmDelete = () => {
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
      <View style={styles.box}>
      <Text style={styles.label}>Adı Soyadı:</Text>
      <Text style={styles.value}>{tahlilData.fullName}</Text>
      </View>
      <View style={styles.box}>
      <Text style={styles.label}>T.C. Kimlik No:</Text>
      <Text style={styles.value}>{tahlilData.tcNumber}</Text>
      </View>
      <View style={styles.box}>
      <Text style={styles.label}>Yaş (Ay):</Text>
      <Text style={styles.value}>{tahlilData.age}</Text>
      </View>
      <View style={styles.box}>
      <Text style={styles.label}>Cinsiyet:</Text>
      <Text style={styles.value}>{tahlilData.gender}</Text>
      </View>
      <View style={styles.box}>
      <Text style={styles.label}>Serum Tipi ve Değerleri:</Text>
      {tahlilData.serumTypes.map((serum, index) => {
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
            <Text style={styles.value
            }>
            {serum.type}: {serum.value} mg/dl{" "}
            {changeArrow && <Text style={getArrowStyle(changeArrow)}>{changeArrow}</Text>}
          </Text>
          {previousValue !== "N/A" && <Text style={styles.value}>Önceki Değer: {previousValue} mg/dl</Text>}
        </View>
      );
    })}
    </View>
<Text style={styles.subTitle}>Kılavuzlara Göre Değerlendirmeler</Text>
{evaluationResults.reduce((acc, result) => {
  if (
    !acc.some(
      (item) => item.guideName === result.guideName && item.ageRange === result.ageRange
    )
  ) {
    acc.push(result);
  }
  return acc;
}, []).map((result, index) => (
  <View key={index} style={styles.tableContainer}>
    <Text style={styles.tableHeader}>{result.guideName}</Text>
    <Text style={styles.tableSubHeader}>Yaş Aralığı: {result.ageRange}</Text>
    <View style={styles.tableRowHeader}>
      <Text style={styles.tableCellHeader}>Serum Tipi</Text>
      {result.evaluations.some((e) => e.geoMean) && <Text style={styles.tableCellHeader}>GeoMean</Text>}
      {result.evaluations.some((e) => e.arithMean) && <Text style={styles.tableCellHeader}>ArithMean</Text>}
      {result.evaluations.some((e) => e.mean) && <Text style={styles.tableCellHeader}>Mean</Text>}
      {result.evaluations.some((e) => e.minmax) && <Text style={styles.tableCellHeader}>Min-Max</Text>}
      {result.evaluations.some((e) => e.interval) && <Text style={styles.tableCellHeader}>Interval</Text>}
    </View>
    {evaluationResults
      .filter(
        (r) =>
          r.guideName === result.guideName && r.ageRange === result.ageRange
      )
      .flatMap((r) => r.evaluations)
      .map((evaluation, evalIndex) => (
        <View key={evalIndex} style={styles.tableRow}>
          <Text style={styles.tableCell}>{evaluation.serumType}</Text>
          {evaluation.geoMean && (
            <Text style={styles.tableCell}>
              {evaluation.geoMean}{" "}
              <Text style={getArrowStyle(evaluation.geoMeanArrow)}>
                {evaluation.geoMeanArrow}
              </Text>
            </Text>
          )}
          {evaluation.arithMean && (
            <Text style={styles.tableCell}>
              {evaluation.arithMean}{" "}
              <Text style={getArrowStyle(evaluation.arithMeanArrow)}>
                {evaluation.arithMeanArrow}
              </Text>
            </Text>
          )}
          {evaluation.mean && (
            <Text style={styles.tableCell}>
              {evaluation.mean}{" "}
              <Text style={getArrowStyle(evaluation.meanArrow)}>
                {evaluation.meanArrow}
              </Text>
            </Text>
          )}
          {evaluation.minmax && (
            <Text style={styles.tableCell}>
              {evaluation.minmax}{" "}
              <Text style={getArrowStyle(evaluation.minmaxArrow)}>
                {evaluation.minmaxArrow}
              </Text>
            </Text>
          )}
          {evaluation.interval && (
            <Text style={styles.tableCell}>
              {evaluation.interval}{" "}
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
  fontSize: 28,
  fontWeight: "bold",
  color: "#0058a3", // Ana başlık rengi
  textAlign: "center",
  marginBottom: 20,
},
subTitle: {
  fontSize: 23,
    fontWeight: "bold",
    color: "#0058a3", // Ana başlık rengi
    textAlign: "center",
    marginBottom: 10,
    marginVertical: 10,
},
label: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginVertical: 5,
},
value: {
  color: "#fff",
  fontSize: 16,
  marginBottom: 15,
},
serumContainer: {
  marginVertical: 5,
  width: "100%",
  backgroundColor: "#0058a3", // Ana buton rengi
  padding: "auto",
  borderRadius: 8,
  alignItems: "center",
  
      
},
backButton: {
  backgroundColor: "#0058a3",
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
box: {
  width: "100%",
  backgroundColor: "#0058a3", // Ana buton rengi
  padding: "auto",
  borderRadius: 8,
  alignItems: "center",
  marginVertical: 10,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: "#ddd",    
},
//yeni ekleme
tableContainer: {
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  backgroundColor: "#f9f9f9",
  padding: 10,
},
tableHeader: {
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
  color: "#0058a3", // Başlık rengi
  marginBottom: 10,
},
tableSubHeader: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 10,
  color: "#0058a3", // Alt başlık rengi
},
tableRowHeader: {
  flexDirection: "row",
  backgroundColor: "#0058a3", // Tablo başlık arka plan rengi
  paddingVertical: 8,
  borderRadius: 5,
},
tableRow: {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderColor: "#ccc",
  paddingVertical: 8,
},
tableCellHeader: {
  flex: 1,
  fontWeight: "bold",
  textAlign: "center",
  fontSize: 14,
  color: "#fff", // Başlık metin rengi
},
tableCell: {
  flex: 1,
  textAlign: "center",
  fontSize: 14,
  color: "#333",
},
});

export default TahlilDetay;
