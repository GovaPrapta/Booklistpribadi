import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; // ✅ Tambahkan Alert
import { auth } from "../firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setLoading(false); // ✅ Set loading ke false dulu sebelum alert
      Alert.alert("Berhasil", "Akun berhasil dibuat!");
      navigation.replace("Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email sudah digunakan. Gunakan email lain.");
      } else if (error.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (error.code === "auth/weak-password") {
        setError("Password terlalu lemah. Gunakan minimal 6 karakter.");
      } else {
        setError("Registrasi gagal. Coba lagi.");
      }
      setLoading(false); // ✅ Jangan lupa stop loading juga di sini
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="small" color="#ffffff" />}
      <Text style={styles.toggleText}>Sudah punya akun?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.toggleButton}>Kembali ke Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#388E3C",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 20,
    textAlign: "center",
  },
  toggleButton: {
    color: "#1976D2",
    textAlign: "center",
    fontWeight: "bold",
  },
});
