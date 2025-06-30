import { Picker } from "@react-native-picker/picker"; // untuk memilih genre
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { auth, db } from "../firebase";

const AddBookScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const genreList = ["", "Novel", "Komik", "Biografi", "Edukasi", "Romantis"];

  const addBook = async () => {
    if (!title.trim() || !author.trim() || !genre) {
      setAlertMessage("Judul, Penulis, dan Genre harus diisi.");
      setIsAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "books"), {
        title: title.trim(),
        author: author.trim(),
        genre: genre,
        rating: 0,
        status: "belum",
        uid: auth.currentUser.uid,
      });

      setTitle("");
      setAuthor("");
      setGenre("");
      setAlertMessage("Buku berhasil ditambahkan.");
      setIsAlertVisible(true);
      navigation.goBack();
    } catch (error) {
      console.error("Gagal menambahkan buku:", error);
      setAlertMessage("Terjadi kesalahan saat menyimpan data");
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Tambah Buku Baru</Text>

        <Text style={styles.label}>Judul Buku</Text>
        <TextInput style={styles.input} placeholder="Masukkan Judul Buku" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Penulis</Text>
        <TextInput style={styles.input} placeholder="Masukkan Nama Penulis" value={author} onChangeText={setAuthor} />

        <Text style={styles.label}>Genre</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={genre} onValueChange={(value) => setGenre(value)} style={styles.picker}>
            {genreList.map((g, idx) => (
              <Picker.Item key={idx} label={g === "" ? "-- Pilih Genre --" : g} value={g} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={addBook}>
              <Text style={styles.buttonText}>💾 Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
              <Text style={styles.buttonText}>❌ Batal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <AwesomeAlert
        show={isAlertVisible}
        showProgress={false}
        title="Pemberitahuan"
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#1976D2"
        onConfirmPressed={() => setIsAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f8ff",
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 45,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonCancel: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddBookScreen;
