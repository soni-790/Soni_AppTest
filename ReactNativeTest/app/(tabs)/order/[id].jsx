import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { getOrderByIdApi } from "../../../src/api/order";
import { AuthContext } from "../../../src/context/AuthContext";
import { Feather } from "@expo/vector-icons";

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const { TOKEN } = useContext(AuthContext);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading order with ID:", id);
      const res = await getOrderByIdApi(id, TOKEN);
      console.log("Order response:", res.data);
      setOrder(res.data.data);
    } catch (error) {
      console.log("Error loading order:", error.message);
      setError(error.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  if (!order || error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <Feather name="alert-circle" size={48} color="#64748b" />
          <Text style={styles.errorText}>Order not found</Text>
          {error && <Text style={styles.errorDetail}>{error}</Text>}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "#10b981";
      case "processing":
        return "#f59e0b";
      case "shipped":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6366f1";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Header */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={styles.value}>{order.paymentStatus || "Pending"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total Items</Text>
            <Text style={styles.value}>{order.totalQuantity || 0}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>${order.totalPrice?.toFixed(2) || "0.00"}</Text>
          </View>
          {order.shippingCost && (
            <>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Shipping</Text>
                <Text style={styles.value}>${order.shippingCost.toFixed(2)}</Text>
              </View>
            </>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>${order.grandTotal?.toFixed(2) || "0.00"}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressBox}>
            <Feather name="map-pin" size={18} color="#6366f1" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressText}>
                {order.shippingAddress?.address || "N/A"}
              </Text>
              <Text style={styles.addressText}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
              </Text>
              {order.shippingAddress?.phone && (
                <Text style={styles.phoneText}>{order.shippingAddress.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items ({order.products?.length || 0})</Text>
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <View key={index}>
                <View style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{product.title || "Product"}</Text>
                    <Text style={styles.productSku}>SKU: {product._id?.slice(-6) || "N/A"}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.quantity}>Qty: {product.quantity}</Text>
                    <Text style={styles.itemPrice}>${(product.price * product.quantity).toFixed(2)}</Text>
                  </View>
                </View>
                {index < order.products.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No items in this order</Text>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: "600",
  },
  errorDetail: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "700",
  },
  orderDate: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "capitalize",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  value: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  totalLabel: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700",
  },
  totalValue: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 4,
  },
  addressBox: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  addressText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },
  phoneText: {
    color: "#6366f1",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  productName: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: 13,
  },
  productSku: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 4,
  },
  quantity: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  itemPrice: {
    color: "#38bdf8",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 2,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 12,
  },
  bottomSpace: {
    height: 40,
  },
});
