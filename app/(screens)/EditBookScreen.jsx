import { Picker } from "@react-native-picker/picker";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../firebase";

const EditBookScreen = ({ route, navigation }) => {
  const book = route?.params?.book;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("belum");
  const [rating, setRating] = useState(0);

  const genreList = ["Novel", "Komik", "Biografi", "Edukasi", "Romantis"];

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setGenre(book.genre || "");
      setStatus(book.status || "belum");
      setRating(book.rating || 0);
    }
  }, [book]);

  const saveEdit = async () => {
    if (!title.trim() || !author.trim() || !genre) {
      Alert.alert("Validasi", "Judul, Penulis, dan Genre harus diisi.");
      return;
    }

    // Jika status sudah, dan rating kosong
    if (status === "sudah" && (!rating || rating === 0)) {
      Alert.prompt(
        "Berikan Rating",
        "Masukkan rating dari 1 sampai 5 untuk buku ini:",
        [
          {
            text: "Batal",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async (input) => {
              const num = parseInt(input);
              if (num >= 1 && num <= 5) {
                await continueSave(num);
              } else {
                Alert.alert("Rating tidak valid", "Masukkan angka antara 1 sampai 5.");
              }
            },
          },
        ],
        "plain-text"
      );
    } else {
      await continueSave(rating);
    }
  };

  const continueSave = async (finalRating) => {
    try {
      const ref = doc(db, "books", book.id);
      await updateDoc(ref, {
        title: title.trim(),
        author: author.trim(),
        genre: genre,
        status,
        rating: status === "sudah" ? finalRating : 0, // reset rating jika status belum
      });
      Alert.alert("Sukses", "Buku berhasil diperbarui");
      navigation.goBack();
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      Alert.alert("Error", "Gagal menyimpan perubahan");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!book || !book.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Data buku tidak ditemukan</Text>
        <Button title="Kembali" onPress={navigation.goBack} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Edit Buku</Text>

        <Text style={styles.label}>Judul Buku</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Masukkan judul baru" />

        <Text style={styles.label}>Penulis</Text>
        <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Masukkan nama penulis" />

        <Text style={styles.label}>Genre</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={genre} onValueChange={(value) => setGenre(value)} style={styles.picker}>
            <Picker.Item label="-- Pilih Genre --" value="" />
            {genreList.map((g, idx) => (
              <Picker.Item key={idx} label={g} value={g} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Status Buku</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
            <Picker.Item label="Belum Selesai" value="belum" />
            <Picker.Item label="Sudah Selesai" value="sudah" />
          </Picker>
        </View>

        {status === "sudah" && (
          <>
            <Text style={styles.label}>⭐ Rating Buku (1 sampai 5)</Text>
            <TextInput
              style={styles.input}
              value={rating ? rating.toString() : ""}
              onChangeText={(value) => {
                const num = parseInt(value);
                if (!isNaN(num) && num >= 1 && num <= 5) {
                  setRating(num);
                } else {
                  setRating(0);
                }
              }}
              placeholder="Masukkan rating (1-5)"
              keyboardType="numeric"
              maxLength={1}
            />
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={saveEdit}>
            <Text style={styles.buttonText}>💾 Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
            <Text style={styles.buttonText}>❌ Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
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

export default EditBookScreen;
