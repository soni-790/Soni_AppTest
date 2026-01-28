import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import { getMyOrdersApi } from "../../src/api/order";
import { router, useFocusEffect } from "expo-router";

export default function Orders() {
  const { TOKEN } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await getMyOrdersApi(TOKEN);
      setOrders(res.data.data.orders);
    } catch (e) {
      console.log("ORDER LOAD ERROR:", e?.response?.data || e.message);
      alert("Failed to load orders");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>📦 No orders yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/order/${item._id}`)}
          >
            <Text style={styles.id}>Order #{item._id.slice(-6)}</Text>
            <Text style={styles.text}>Items: {item.totalQuantity}</Text>
            <Text style={styles.text}>Total: ${item.grandTotal}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 12 },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  card: {
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  id: { color: "#38bdf8", fontWeight: "700" },
  text: { color: "white", marginTop: 4 },
  status: { color: "#fbbf24", marginTop: 4 },
});
