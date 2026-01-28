import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import { router } from "expo-router";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("password123");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome To Ecommerce App</Text>
        <Text style={styles.subtitle}>Login to continue shopping</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="rgb(156, 163, 175)"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="rgb(156, 163, 175)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(248, 250, 252)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  title: {
    color: "rgb(30, 41, 59)",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748B",
    marginBottom: 28,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    color: "#1E293B",
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    elevation: 4,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    color: "#7C3AED",
    textAlign: "center",
    marginTop: 16,
  },
});
