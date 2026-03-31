import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (user.role === "student") router.push("/student/dashboard" as any);
      else if (user.role === "teacher")
        router.push("/teacher/dashboard" as any);
      else if (user.role === "accountant")
        router.push("/accountant/dashboard" as any);
      else if (user.role === "admin") router.push("/admin/dashboard" as any);
      else Alert.alert("Error", "Unknown role: " + user.role);
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message ||
          "Something went wrong. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.appName}>SchoolOS</Text>
        <Text style={styles.tagline}>School Management System</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.forgotText}>Forgot password?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a3a6b",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a3a6b",
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  loginBtn: {
    backgroundColor: "#1a3a6b",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  loginBtnDisabled: {
    backgroundColor: "#7a9abf",
  },
  loginBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  forgotText: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    color: "#1a3a6b",
  },
});
