import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import { PRODUCT_STORAGE_KEY } from "../features/product/productSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
  },
});

// Persist products locally so they survive refresh.
if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      const products = store.getState().product.products;
      window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage write failures (e.g., blocked by browser settings).
    }
  });
}