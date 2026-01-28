import { Slot, router } from "expo-router";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { CartProvider } from "../src/context/CartContext";


function AuthWrapper() {
  const { user } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, mounted]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <AuthWrapper />
      </CartProvider>
    </AuthProvider>
  );
}

