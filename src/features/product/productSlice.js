import { createSlice } from "@reduxjs/toolkit";

export const PRODUCT_STORAGE_KEY = "redux_product_app_products_v1";

function generateId() {
  // Simple unique id generator for local-only usage.
  return `${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
}

function loadProductsFromStorage() {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Backward compatibility: older versions may have stored plain strings.
    return parsed.map((p) => {
      if (typeof p === "string") return { id: generateId(), name: p };
      if (p && typeof p === "object" && typeof p.name === "string") {
        return { id: p.id ?? generateId(), name: p.name };
      }
      return null;
    }).filter(Boolean);
  } catch {
    return [];
  }
}

const initialState = {
  products: loadProductsFromStorage(),
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const name = String(action.payload ?? "").trim();
      if (!name) return;
      state.products.push({ id: generateId(), name });
    },
    editProduct: (state, action) => {
      const { id, name } = action.payload;
      const nextName = String(name ?? "").trim();
      if (!id || !nextName) return;

      const existing = state.products.find((p) => p.id === id);
      if (existing) existing.name = nextName;
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      const idx = state.products.findIndex((p) => p.id === id);
      if (idx !== -1) state.products.splice(idx, 1);
    },
  },
});

export const { addProduct, editProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;