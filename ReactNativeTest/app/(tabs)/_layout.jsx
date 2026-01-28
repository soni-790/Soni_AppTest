import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#020617", borderTopWidth: 0 },
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="cart"
  options={{
    title: "Cart",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="cart" size={size} color={color} />
    ),
  }}
/>
<Tabs.Screen
  name="orders"
  options={{
    title: "Orders",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="receipt" size={size} color={color} />
    ),
  }}
/>

      

    </Tabs>

    
  );
}
