import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useContext } from "react";
import { CartContext } from "../../src/context/CartContext";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
  } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>🛒 Cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>

              <View style={styles.row}>
                <TouchableOpacity onPress={() => decreaseQty(item._id)}>
                  <Text style={styles.qtyBtn}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity onPress={() => increaseQty(item._id)}>
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeFromCart(item._id)}
                >
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    color: "#64748B",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    margin: 12,
    borderRadius: 14,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },
  title: { color: "#1E293B", fontWeight: "600", fontSize: 15 },
  price: { color: "#7C3AED", marginTop: 4, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    color: "#7C3AED",
    fontSize: 20,
    marginHorizontal: 12,
    fontWeight: "700",
  },
  qty: { color: "#1E293B", fontSize: 16, fontWeight: "600" },
  remove: { color: "#F97316", marginLeft: 12, fontWeight: "600" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  total: { color: "#1E293B", fontSize: 18, fontWeight: "800" },
  checkout: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    elevation: 4,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  checkoutText: {
    fontWeight: "800",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
