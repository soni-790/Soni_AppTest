import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useContext, useState } from "react";
import { CartContext } from "../../src/context/CartContext";
import { AuthContext } from "../../src/context/AuthContext";
import { createOrderApi } from "../../src/api/order";
import { router } from "expo-router";

export default function Checkout() {
  const { cart, totalPrice } = useContext(CartContext);
  const { user, TOKEN } = useContext(AuthContext);

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleOrder = async () => {
    try {
      const orderData = {
        products: cart.map((i) => ({
          productId: i._id || i.id,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        paymentMethod: "card",
      };

      await createOrderApi(orderData, TOKEN);
      alert("Order placed successfully!");
      router.push("/(tabs)/orders");
    } catch (e) {
      alert("Order failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      {["address", "city", "state", "postalCode", "country"].map((f) => (
        <TextInput
          key={f}
          placeholder={f}
          placeholderTextColor="#94a3b8"
          style={styles.input}
          onChangeText={(v) => setAddress({ ...address, [f]: v })}
        />
      ))}

      <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>

      <TouchableOpacity style={styles.btn} onPress={handleOrder}>
        <Text style={styles.btnText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  heading: { color: "#1E293B", fontSize: 24, fontWeight: "800", marginBottom: 20 },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 14,
    color: "#1E293B",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    fontSize: 16,
  },
  total: { color: "#1E293B", fontSize: 18, marginTop: 16, fontWeight: "800" },
  btn: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    elevation: 4,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnText: { fontWeight: "800", color: "#FFFFFF", fontSize: 16 },
});
