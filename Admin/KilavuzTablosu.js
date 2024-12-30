import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Alert, Modal, ScrollView,TouchableOpacity} from "react-native";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
const KilavuzTablosu = ({ route, navigation }) => {
  const { guideId } = route.params;
  const [guideData, setGuideData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const docRef = doc(db, "guides", guideId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuideData(docSnap.data().data || []);
          setFilteredData(docSnap.data().data || []);
        } else {
          Alert.alert("Hata", "Kılavuz bulunamadı!");
        }
      } catch (error) {
        console.error("Kılavuz çekilemedi: ", error);
      }
    };

    fetchGuide();
  }, [guideId]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = guideData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleInputChange = (field, value) => {
    const updatedItem = { ...editingItem, [field]: value };
    setEditingItem(updatedItem);
  };

  const handleSave = async () => {
    try {
      // Verileri string'den sayıya dönüştür
      const updatedItem = {
        ...editingItem,
        geoMeanMin: editingItem.geoMeanMin ? parseFloat(editingItem.geoMeanMin) : NaN,
        geoMeanMax: editingItem.geoMeanMax ? parseFloat(editingItem.geoMeanMax) : NaN,
        meanMin: editingItem.meanMin ? parseFloat(editingItem.meanMin) : NaN,
        meanMax: editingItem.meanMax ? parseFloat(editingItem.meanMax) : NaN,
        arithMeanMin: editingItem.arithMeanMin ? parseFloat(editingItem.arithMeanMin) : NaN,
        arithMeanMax: editingItem.arithMeanMax ? parseFloat(editingItem.arithMeanMax) : NaN,
        intervalMin: editingItem.intervalMin ? parseFloat(editingItem.intervalMin) : NaN,
        intervalMax: editingItem.intervalMax ? parseFloat(editingItem.intervalMax) : NaN,
        min: editingItem.min ? parseFloat(editingItem.min) : NaN,
        max: editingItem.max ? parseFloat(editingItem.max) : NaN,
      };
  
      // guideData'yı güncelle
      const updatedData = [...guideData];
      if (editingIndex !== null) {
        updatedData[editingIndex] = updatedItem; // Index bazlı güncelleme
      }
  
      // Firestore'da güncelle
      const docRef = doc(db, "guides", guideId);
      await updateDoc(docRef, { data: updatedData });
  
      // Local state güncelle
      setGuideData(updatedData);
      setFilteredData(updatedData);
      Alert.alert("Başarılı", "Kılavuz başarıyla güncellendi!");
      setIsEditing(false); // Modalı kapat
    } catch (error) {
      console.error("Kılavuz güncellenemedi: ", error);
      Alert.alert("Hata", "Kılavuz güncellenirken bir hata oluştu!");
    }
  };
  const handleDelete = async () => {
      try {
        const docRef = doc(db, "guides", guideId);
        await deleteDoc(docRef);
        Alert.alert("Başarılı", "Kılavuz başarıyla silindi.");
        navigation.goBack(); // Silme işlemi sonrası geri git
      } catch (error) {
        console.error("Kılavuz silinirken hata oluştu:", error);
        Alert.alert("Hata", "Kılavuz silinirken bir hata oluştu.");
      }
    };  
  const confirmDelete = () => { //tahlil silme onay kısmı
      Alert.alert(
        "Silme Onayı",
        "Bu kılavuzu silmek istediğinizden emin misiniz?",
        [
          { text: "Hayır", style: "cancel" },
          { text: "Evet", onPress: handleDelete }
        ]
      );
    };

  const openEditModal = (item, index) => {
    // Set the item that needs to be edited into the modal
    setEditingItem(item);
    setEditingIndex(index);
    setIsEditing(true); // Open modal
  };

  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>{guideId} Kılavuzu</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Yaş Aralığına Göre Ara..."
        value={searchText}
        onChangeText={handleSearch}
      />
    
      
      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.table}>
          
          <View style={styles.tableRowHeader}>
            <Text style={styles.headerCell}>Yaş (Ay)</Text>
            <Text style={styles.headerCell}>Geo Mean</Text>
            <Text style={styles.headerCell}>Mean</Text>
            <Text style={styles.headerCell}>Arith Mean</Text>
            <Text style={styles.headerCell}>Min-Max</Text>
            <Text style={styles.headerCell}>%95 confidence intervals</Text>
            <Text style={styles.headerCell}>Serum Type</Text>
            <Text style={styles.headerCell}></Text>
          </View>

          {/* Tablo Verileri */}
          <FlatList
            data={filteredData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.tableRow}>
                <Text style={styles.cell}>{item.ageRange}</Text>
                <Text style={styles.cell}>{item.geoMeanMin}-{item.geoMeanMax}</Text>
                <Text style={styles.cell}>{item.meanMin}-{item.meanMax}</Text>
                <Text style={styles.cell}>{item.arithMeanMin}-{item.arithMeanMax}</Text>
                <Text style={styles.cell}>{item.min}-{item.max}</Text>
                <Text style={styles.cell}>{item.intervalMin}-{item.intervalMax}</Text>
                <Text style={styles.cell}>{item.serumType}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={() => openEditModal(item, index)}>
                    <Text style={styles.ButtonText}>Düzenle</Text>
                </TouchableOpacity>
                
              </View>
            )}
          />
            <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("KilavuzGuncelle", { guideId })}>
                    <Text style={styles.ButtonText}>Yeni Satır Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                    <Text style={styles.ButtonText}>Kılavuzu Sil</Text>
                  </TouchableOpacity>
                          
        </View>
      </ScrollView>

      
      {isEditing && (
        <Modal
          visible={isEditing}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditing(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView > 
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Kılavuz Düzenle</Text>

            
                <Text style={styles.inputLabel}>Yaş (Ay)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.ageRange}
                  onChangeText={(value) => handleInputChange("ageRange", value)}
                />

            
                <Text style={styles.inputLabel}>Geo Mean (Min)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.geoMeanMin}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("geoMeanMin", value)}
                />
              
                <Text style={styles.inputLabel}>Geo Mean (Max)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.geoMeanMax}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("geoMeanMax", value)}
                />

              
                <Text style={styles.inputLabel}>Mean(Min)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.meanMin}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("meanMin", value)}
                />
                <Text style={styles.inputLabel}>Mean(Max)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.meanMax}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("meanMax", value)}
                />
                <Text style={styles.inputLabel}>Arith Mean(Min)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.arithMeanMin}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("arithMeanMin", value)}
                />
                <Text style={styles.inputLabel}>Arith Mean(Max)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.arithMeanMax}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("arithMeanMax", value)}
                />
                <Text style={styles.inputLabel}>Min</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.min}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("min", value)}
                />
                <Text style={styles.inputLabel}>Max</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.max}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("max", value)}
                />
                <Text style={styles.inputLabel}>%95 confidence intervals(Min)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.intervalMin}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("intervalMin", value)}
                />
                <Text style={styles.inputLabel}>%95 confidence intervals(Max)</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.intervalMax}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("intervalMax", value)}
                />          
                <Text style={styles.inputLabel}>Serum Type</Text>
                <TextInput
                  style={styles.cellInput}
                  value={editingItem.serumType}
                  onChangeText={(value) => handleInputChange("serumType", value)}
                />
                   <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.ButtonText}>Kaydet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                    <Text style={styles.ButtonText}>Vazgeç</Text>
                    </TouchableOpacity>
                  

              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#0058a3", // Ana başlık rengi
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    flexDirection: "column",
    flex: 1,
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
  headerCell: {
    width: 100,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    backgroundColor: "#0058a3",
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
  },
  cell: {
    width: 100,
    textAlign: "center",
    padding: 5,
  },
  cellInput: {
    width: "auto",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    padding: 5,
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "auto",
    height: "auto",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  saveButton: {
    paddingVertical: 10,
    borderRadius: 8,
    padding: 15,
    margin: 4,
    width: "auto",
    alignSelf: "center",
    backgroundColor: "#0058a3",
  },
  ButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
   searchInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 8,
    padding: 15,
    margin: 4,
    width: "auto",
    alignSelf: "center",
  }
});

export default KilavuzTablosu;