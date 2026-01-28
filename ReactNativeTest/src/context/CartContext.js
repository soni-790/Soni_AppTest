import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getId = (product) => product._id || product.id;

 const addToCart = (product) => {
  const productId = product._id || product.id || product.sku || product.title;

  if (!productId) {
    console.log("NO ID PRODUCT:", product);
    return;
  }

  setCart((prev) => {
    const exists = prev.find((i) => i.__cartId === productId);

    if (exists) {
      return prev.map((i) =>
        i.__cartId === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    }

    return [
      ...prev,
      {
        ...product,
        __cartId: productId, 
        quantity: 1,
      },
    ];
  });
};


  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        getId(i) === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          getId(i) === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => getId(i) !== id));
  };

  const totalPrice = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        totalPrice,
        getId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
