import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllProductsApi } from "../../src/api/product";
import { router } from "expo-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProductsApi(1, 20);
      setProducts(res.data.data.products);
    } catch (err) {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛍️ Explore Products</Text>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card } onPress={() => router.push(`/(tabs)/product/${item._id}`)}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />

            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.price}>${item.price}</Text>

            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#1E293B",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  image: {
    height: 130,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },
  rating: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
});
