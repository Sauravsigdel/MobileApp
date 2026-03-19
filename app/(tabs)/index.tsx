import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const router = useRouter();

  const roles = ["student", "teacher", "accountant", "admin"];

  return (
    <View style={styles.container}>
      {/* Logo area */}
      <View style={styles.logoArea}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.appName}>SchoolOS</Text>
        <Text style={styles.tagline}>School Management System</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>

        {/* Role selector */}
        <Text style={styles.label}>Login as</Text>
        <View style={styles.roleRow}>
          {roles.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.rolePill, role === r && styles.rolePillActive]}
              onPress={() => setRole(r)}
            >
              <Text
                style={[
                  styles.rolePillText,
                  role === r && styles.rolePillTextActive,
                ]}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email */}
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

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Login button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            if (role === "student") router.push("/student/dashboard" as any);
            else if (role === "teacher")
              router.push("/teacher/dashboard" as any);
            else if (role === "accountant")
              router.push("/accountant/dashboard" as any);
            else if (role === "admin") router.push("/admin/dashboard" as any);
          }}
        >
          <Text style={styles.loginBtnText}>Sign in</Text>
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
  roleRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  rolePillActive: {
    backgroundColor: "#1a3a6b",
    borderColor: "#1a3a6b",
  },
  rolePillText: {
    fontSize: 12,
    color: "#666",
  },
  rolePillTextActive: {
    color: "#ffffff",
    fontWeight: "600",
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
