import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { getOrderByIdApi } from "../../../src/api/order";
import { AuthContext } from "../../../src/context/AuthContext";

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const { TOKEN } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await getOrderByIdApi(id, TOKEN);
      setOrder(res.data.data);
    } catch {
      alert("Failed to load order");
    }
  };

  if (!order) {
    return (
      <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Order Detail</Text>

      <Text style={styles.text}>Order ID: {order._id}</Text>
      <Text style={styles.text}>Status: {order.status}</Text>
      <Text style={styles.text}>Payment: {order.paymentStatus}</Text>
      <Text style={styles.text}>Total: ${order.grandTotal}</Text>

      <Text style={styles.section}>Shipping Address</Text>
      <Text style={styles.text}>
        {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
        {order.shippingAddress.state}
      </Text>

      <Text style={styles.section}>Items</Text>
      {order.products.map((p, i) => (
        <Text key={i} style={styles.text}>
          {p.title} x {p.quantity}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  center: { flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center" },
  heading: { color: "#1E293B", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  section: { color: "#7C3AED", marginTop: 14, fontWeight: "700" },
  text: { color: "#1E293B", marginTop: 6 },
});
