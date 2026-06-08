import axios from "axios";

const API_URL = "/products.json";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching local backup json records:", error);
    return [];
  }
};

export const placeOrder = async (cartItems) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `irui-ord-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        orderTime: new Date().toISOString(),
        totalCostCents: cartItems.reduce(
          (sum, item) => sum + item.priceCents * item.quantity,
          0,
        ),
        products: cartItems,
      });
    }, 600);
  });
};
