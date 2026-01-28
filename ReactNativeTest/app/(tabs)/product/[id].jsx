import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getSingleProductApi } from "../../../src/api/product.js"
import { CartContext } from "../../../src/context/CartContext.js";
import { useContext } from "react";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await getSingleProductApi(id);
      setProduct(res.data.data);
    } catch (err) {
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
    );
  }

  if (!product) return null;

  
console.log("OPENED PRODUCT:", product?._id, product?.id, product?.title);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.rating}>⭐ {product.rating}</Text>

        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <Text style={styles.section}>Brand</Text>
        <Text style={styles.desc}>{product.brand}</Text>

        <Text style={styles.section}>Stock</Text>
        <Text style={styles.desc}>{product.stock} available</Text>
      </View>
      <TouchableOpacity
  style={styles.addBtn}
  onPress={() => addToCart(product)}
>
  <Text style={styles.addText}>Add to Cart</Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },
  center: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrap: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 16,
    padding: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  title: {
    color: "#1E293B",
    fontSize: 22,
    fontWeight: "700",
  },
  price: {
    color: "#7C3AED",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },
  rating: {
    color: "#64748B",
    marginTop: 4,
  },
  section: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
  },
  desc: {
    color: "#475569",
    marginTop: 6,
    lineHeight: 20,
  },
  addBtn: {
  backgroundColor: "#7C3AED",
  padding: 14,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 20,
},
addText: {
  fontWeight: "700",
  color: "#FFFFFF",
  fontSize: 16,
},

});
