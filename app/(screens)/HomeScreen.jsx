import { Picker } from "@react-native-picker/picker";
import { signOut } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebase";

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const genreList = ["", "Novel", "Komik", "Biografi", "Edukasi", "Romantis"];

  useEffect(() => {
    const user = auth.currentUser;
    const uid = user?.uid;
    if (!uid) return;

    setUserEmail(user.email);

    const q = query(collection(db, "books"), where("uid", "==", uid));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBooks(data);
        setLoading(false);
      },
      (error) => {
        setError("Failed to fetch books.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "books", id));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === "" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const total = filteredBooks.length;
  const selesai = filteredBooks.filter((b) => b.status === "sudah").length;
  const belum = total - selesai;

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      {item.coverImage && <Image source={{ uri: item.coverImage }} style={styles.bookCover} />}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>Penulis: {item.author}</Text>
        {item.genre && <Text style={styles.bookGenre}>Genre: {item.genre}</Text>}
        {item.status === "sudah" && <Text style={styles.bookRating}>Rating: {Array(item.rating).fill("⭐").join("")}</Text>}
        <Text style={[styles.bookStatus, item.status === "sudah" ? styles.statusDone : styles.statusPending]}>{item.status === "sudah" ? "✅ Selesai dibaca" : "⏳ Belum selesai"}</Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditBook", { book: item })}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View>
          <Text style={styles.navTitle}>My Book List</Text>
          <Text style={styles.navSubtitle}>👤 {userEmail}</Text> {/* ✅ tampilkan email */}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput style={styles.searchInput} placeholder="Cari buku..." value={searchQuery} onChangeText={setSearchQuery} />

      {/* Genre Picker */}
      <View style={styles.genreFilterWrapper}>
        <Picker selectedValue={selectedGenre} onValueChange={(value) => setSelectedGenre(value)} style={styles.picker}>
          {genreList.map((genre, index) => (
            <Picker.Item key={index} label={genre === "" ? "📚 Semua Genre" : genre} value={genre} />
          ))}
        </Picker>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryEmoji}>🕶</Text>
          <Text style={styles.summaryLabel}>Total Buku</Text>
          <Text style={styles.summaryValue}>{total}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryEmoji}>✅</Text>
          <Text style={styles.summaryLabel}>Selesai</Text>
          <Text style={styles.summaryValue}>{selesai}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryEmoji}>⏳</Text>
          <Text style={styles.summaryLabel}>Belum</Text>
          <Text style={styles.summaryValue}>{belum}</Text>
        </View>
      </View>

      {/* Daftar Buku */}
      {total === 0 ? <Text style={styles.emptyText}>Tidak ada buku tersedia.</Text> : <FlatList data={filteredBooks} keyExtractor={(item) => item.id} renderItem={renderBookItem} contentContainerStyle={{ paddingBottom: 100 }} />}

      {/* Tombol Tambah Buku */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddBook")}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2F8",
  },
  navbar: {
    height: 80,
    backgroundColor: "#1565C0",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    elevation: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  navTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  navSubtitle: {
    color: "#BBDEFB",
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginTop: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  searchInput: {
    height: 42,
    borderColor: "#BBDEFB",
    borderWidth: 1.2,
    borderRadius: 30,
    paddingHorizontal: 16,
    margin: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  genreFilterWrapper: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: "#BBDEFB",
    overflow: "hidden",
  },
  picker: {
    height: 42,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 12,
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    elevation: 2,
  },
  summaryEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#212121",
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 4,
    color: "#616161",
  },
  bookGenre: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 4,
    color: "#5D4037",
  },
  bookRating: {
    fontSize: 14,
    marginBottom: 6,
    color: "#FFD700",
  },
  bookStatus: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: "bold",
  },
  statusDone: {
    color: "#2E7D32",
  },
  statusPending: {
    color: "#F57C00",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  editButton: {
    backgroundColor: "#0288D1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1565C0",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
