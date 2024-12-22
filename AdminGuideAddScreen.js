import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebase";

const AdminGuideAddScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");

  const handleAddGuide = async () => {
    if (!title || !content || !reference) {
      Alert.alert("Hata", "Tüm alanları doldurmanız gerekiyor!");
      return;
    }

    try {
      // Firestore'daki "guides" koleksiyonuna yeni bir belge ekle
      const guideCollection = collection(firestore, "guides");
      await addDoc(guideCollection, { title, content, reference });

      Alert.alert("Başarılı", "Kılavuz başarıyla eklendi!");
      setTitle("");
      setContent("");
      setReference("");
      navigation.goBack(); // Yönetici paneline dön
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Kılavuz eklenirken bir sorun oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Kılavuz Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="İçerik"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Referans"
        value={reference}
        onChangeText={setReference}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddGuide}>
        <Text style={styles.buttonText}>Kılavuz Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6200ee",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AdminGuideAddScreen;
