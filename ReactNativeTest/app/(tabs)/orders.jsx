import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import { getMyOrdersApi } from "../../src/api/order";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Orders() {
  const { TOKEN } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const loadOrders = async () => {
    try {
      const res = await getMyOrdersApi(TOKEN);
      setOrders(res.data.data.orders);
    } catch (e) {
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
      <View style={styles.empty}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="cube-outline" size={90} color="#334155" />
        <Text style={styles.emptyText}>No orders yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🔷 Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.sub}>
          {orders.length} orders found
        </Text>
      </View>

      {/* 🔷 Orders */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/order/${item._id}`)}
          >
            <View style={styles.row}>
              <Text style={styles.id}>Order #{item._id.slice(-6)}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Items</Text>
              <Text style={styles.value}>{item.totalQuantity}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Total</Text>
              <Text style={styles.total}>${item.grandTotal}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#1e293b",
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },

  sub: {
    color: "#94a3b8",
    marginTop: 2,
  },

  empty: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 18,
  },

  card: {
    backgroundColor: "#0f172a",
    margin: 14,
    borderRadius: 18,
    padding: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  id: {
    color: "#38bdf8",
    fontWeight: "900",
  },

  statusPill: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  status: {
    color: "#fbbf24",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: "#1e293b",
    marginVertical: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  label: {
    color: "#94a3b8",
  },

  value: {
    color: "white",
    fontWeight: "700",
  },

  total: {
    color: "#38bdf8",
    fontWeight: "900",
    fontSize: 16,
  },
});