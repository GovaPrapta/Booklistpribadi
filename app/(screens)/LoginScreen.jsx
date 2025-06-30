import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail(""); // Mengosongkan email
      setPassword(""); // Mengosongkan password
      navigation.replace("Home");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("Email tidak ditemukan. Gunakan email yang sudah terdaftar.");
      } else if (error.code === "auth/wrong-password") {
        setError("Password salah. Coba lagi.");
      } else if (error.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError("Login gagal. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../Asset/Logo.png")} style={styles.logo} />
      <Text style={styles.title}>Selamat Datang</Text>
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="small" color="#ffffff" />}
      <Text style={styles.toggleText}>Belum punya akun?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.toggleButton}>Daftar Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 175,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },

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
    backgroundColor: "#1976D2",
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
