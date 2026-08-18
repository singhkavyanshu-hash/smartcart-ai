import { useEffect, useState } from "react";
import CartContext from "./cartContext";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("smartcart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch {
      localStorage.removeItem("smartcart");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "smartcart",
      JSON.stringify(cart)
    );
  }, [cart]);

  function addToCart(product) {
  setCart((currentCart) => {
    const existingProduct = currentCart.find(
      (item) => item.id === product.id
    );

    // Product has no stock
    if (Number(product.stock) <= 0) {
      return currentCart;
    }

    // Product already exists in cart
    if (existingProduct) {
      // Don't allow quantity above available stock
      if (
        existingProduct.quantity >=
        Number(product.stock)
      ) {
        return currentCart;
      }

      return currentCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    }

    // Add new product
    return [
      ...currentCart,
      {
        ...product,
        quantity: 1,
      },
    ];
  });
}

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  }

  function increaseQuantity(productId) {
  setCart((currentCart) =>
    currentCart.map((item) => {
      if (item.id !== productId) {
        return item;
      }

      // Don't exceed available stock
      if (item.quantity >= Number(item.stock)) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity + 1,
      };
    })
  );
}

  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}