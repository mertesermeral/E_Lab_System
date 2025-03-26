import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, BackHandler } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Kilavuz from "./Kilavuz";
import KilavuzList from "./KilavuzList";
import TahlilEkle from "./TahlilEkle";
import TahlilList from "./TahlilList";
import { useFocusEffect } from "@react-navigation/native"; // Sayfa odaklandığında sıfırlama için

const Drawer = createDrawerNavigator();

// Serum değerini değerlendirme fonksiyonu
const evaluateSerumValue = (serumValue, min, max) => {
  if (serumValue < min) return "↓"; // düşük
  if (serumValue > max) return "↑"; // yüksek
  return "↔"; // normal
};

// Okların hizalanması
const getArrowWithAlignment = (rangeText, arrow) => {
    const [min, max] = rangeText.split(/(?<!^)-/);

  switch (arrow) {
    case "↓":
      return (
        <Text style={{ color: "red", fontWeight: "bold" }}>
          {arrow} {rangeText}
        </Text>
      );
    case "↔":
      return (
        <Text style={{  color: "green", fontWeight: "bold" }}>
          {min.trim()} {arrow} {max.trim()}
        </Text>
      );
    case "↑":
      return (
        <Text style={{  color: "blue", fontWeight: "bold" }}>
          {rangeText} {arrow}
        </Text>
      );
    default:
      return <Text>{rangeText}</Text>;
  }
};

const DashboardHome = ({navigation}) => {
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert("Uyarı", "Oturumdan çıkmak istiyor musunuz?", [
          { text: "Hayır", style: "cancel" },
          { text: "Evet", onPress: () => navigation.replace("Home") },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState(0);
  const [serumValues, setSerumValues] = useState({
    IgG: "",
    IgG1: "",
    IgG2: "",
    IgG3: "",
    IgG4: "",
    IgA: "",
    IgA1: "",
    IgA2: "",
    IgM: "",
  });
  const [guides, setGuides] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState([]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guides"));
        const guidesData = [];
        querySnapshot.forEach((doc) => guidesData.push({ guideName: doc.id, data: doc.data().data }));
        setGuides(guidesData);
      } catch (error) {
        Alert.alert("Hata", "Kılavuzlar alınırken bir hata oluştu.");
      }
    };

    fetchGuides();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      setBirthDate("");
      setAge(0);
      setSerumValues({
        IgG: "",
        IgG1: "",
        IgG2: "",
        IgG3: "",
        IgG4: "",
        IgA: "",
        IgA1: "",
        IgA2: "",
        IgM: "",
      });
      setEvaluationResults([]);
    }, [])
  );
  const calculateAgeInMonths = (birthDateStr) => {
    const parts = birthDateStr.split("/");
    if (parts.length !== 3) return 0;
    const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const currentDate = new Date();
    return (currentDate.getFullYear() - birthDate.getFullYear()) * 12 + (currentDate.getMonth() - birthDate.getMonth());
  };

  const handleBirthDateChange = (value) => {
    const formattedValue = value.replace(/[^0-9]/g, "").replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    setBirthDate(formattedValue);
    if (formattedValue.length === 10) {
      const calculatedAge = calculateAgeInMonths(formattedValue);
      setAge(calculatedAge);
    }
  };

  const handleEvaluate = () => {
    if (!birthDate) {
      Alert.alert("Hata", "Lütfen doğum tarihini girin!");
      return;
    }

    const serumValuesArray = Object.entries(serumValues)
      .filter(([_, value]) => value.trim() !== "") // Boş serum değerlerini filtrele
      .map(([type, value]) => ({
        serumType: type,
        value: parseFloat(value),
      }));

    const results = guides.map((guide) => {
      const filteredRows = guide.data.filter((row) => {
        const [minAge, maxAge] = row.ageRange.split("-").map(Number);
        return (!minAge || age >= minAge) && (!maxAge || age <= maxAge);
      });

      const evaluations = filteredRows.flatMap((row) =>
        serumValuesArray
          .map((serum) => {
            if (row.serumType === serum.serumType) {
              const geoMeanEvaluation = isNaN(row.geoMeanMin) || isNaN(row.geoMeanMax)
                ? null
                : evaluateSerumValue(serum.value, row.geoMeanMin, row.geoMeanMax);

              const arithMeanEvaluation = isNaN(row.arithMeanMin) || isNaN(row.arithMeanMax)
                ? null
                : evaluateSerumValue(serum.value, row.arithMeanMin, row.arithMeanMax);

              const meanEvaluation = isNaN(row.meanMin) || isNaN(row.meanMax)
                ? null
                : evaluateSerumValue(serum.value, row.meanMin, row.meanMax);

              const intervalEvaluation = isNaN(row.intervalMin) || isNaN(row.intervalMax)
                ? null
                : evaluateSerumValue(serum.value, row.intervalMin, row.intervalMax);

              const minmaxEvaluation = isNaN(row.min) || isNaN(row.max)
                ? null
                : evaluateSerumValue(serum.value, row.min, row.max);

              return {
                serumType: serum.serumType,
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
          })
          .filter(Boolean)
      );

      return evaluations.length ? { guideName: guide.guideName, ageRange: filteredRows[0]?.ageRange || "-", evaluations } : null;
    }).filter(Boolean);

    setEvaluationResults(results);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Hızlı Değerlendirme</Text>

      <TextInput
        style={styles.input}
        placeholder="Doğum Tarihi (GG/AA/YYYY)"
        value={birthDate}
        onChangeText={handleBirthDateChange}
      />
      <Text style={styles.ageDisplay}>Yaş (Ay): {age}</Text>

      <Text style={styles.subTitle}>Serum Değerleri:</Text>
      <View style={styles.inputGrid}>
        {Object.keys(serumValues).map((serumType) => (
          <View key={serumType} style={styles.inputWrapper}>
            <TextInput
              style={styles.inputSmall}
              placeholder={`${serumType}`}
              keyboardType="numeric"
              value={serumValues[serumType]}
              onChangeText={(value) => setSerumValues((prev) => ({ ...prev, [serumType]: value }))}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.evaluateButton} onPress={handleEvaluate}>
        <Text style={styles.ButtonText}>Değerlendir</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Kılavuzlara Göre Değerlendirmeler</Text>
      {evaluationResults.length === 0 && <Text style={styles.infoText}>Henüz değerlendirme yapılmadı.</Text>}
      {evaluationResults.map((result, index) => (
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
          {result.evaluations.map((evaluation, evalIndex) => (
            <View key={evalIndex} style={styles.tableRow}>
              <Text style={styles.tableCell}>{evaluation.serumType}</Text>
              {evaluation.geoMean && (
                <Text style={styles.tableCell}>
                  {getArrowWithAlignment(evaluation.geoMean, evaluation.geoMeanArrow)}
                </Text>
              )}
              {evaluation.arithMean && (
                <Text style={styles.tableCell}>
                  {getArrowWithAlignment(evaluation.arithMean, evaluation.arithMeanArrow)}
                </Text>
              )}
              {evaluation.mean && (
                <Text style={styles.tableCell}>
                  {getArrowWithAlignment(evaluation.mean, evaluation.meanArrow)}
                </Text>
              )}
              {evaluation.minmax && (
                <Text style={styles.tableCell}>
                  {getArrowWithAlignment(evaluation.minmax, evaluation.minmaxArrow)}
                </Text>
              )}
              {evaluation.interval && (
                <Text style={styles.tableCell}>
                  {getArrowWithAlignment(evaluation.interval, evaluation.intervalArrow)}
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
const AdminDashboard = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Ana Sayfa"
      screenOptions={{
        drawerStyle: { width: 240, backgroundColor: "#f7f7f7" },
      }}
    >
      <Drawer.Screen
        name="Ana Sayfa"
        component={DashboardHome}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Kılavuz Oluşturma"
        component={Kilavuz}
        options={{ title: "Kılavuz Oluştur" }}
      />
      <Drawer.Screen
        name="Kılavuz Listeleme"
        component={KilavuzList}
        options={{ title: "Kılavuz Listesi" }}
      />
      <Drawer.Screen
        name="Tahlil Ekle"
        component={TahlilEkle}
        options={{ title: "Tahlil Ekle" }}
      />
      <Drawer.Screen
        name="Tahlil Listeleme"
        component={TahlilList}
        options={{ title: "Tahlil Listesi" }}
      />
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 },
  ageDisplay: { fontSize: 16, marginBottom: 10 },
  evaluateButton: { backgroundColor: "green", padding: 15, borderRadius: 8 },
  infoText: { textAlign: "center", marginVertical: 20, color: "#777" },
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
  ButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputWrapper: {
    width: "48%", // 2 sütun düzeni
    marginBottom: 10,
  },
  inputSmall: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 8 },
});

export default AdminDashboard;
