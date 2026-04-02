import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct, editProduct } from "./productSlice";

const Product = () => {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const handleAdd = () => {
    if (name.trim() !== "") {
      dispatch(addProduct(name));
      setName("");
    }
  };

  const handleStartEdit = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setEditingId(id);
    setEditingName(product.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = (id) => {
    const nextName = editingName.trim();
    if (nextName !== "") {
      dispatch(editProduct({ id, name: nextName }));
      handleCancelEdit();
    }
  };

  return (
    <div className="product-app">
      <div className="product-card">
        <div className="product-header">
          <div>
            <h2>Product App names</h2>
            <div className="product-subtitle">Add, edit, or delete your products.</div>
          </div>
        </div>

        <form
          className="product-controls"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <input
            className="product-input"
            type="text"
            placeholder="Enter product"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            className="product-button product-button-primary"
            type="submit"
            onClick={handleAdd}
            disabled={name.trim() === ""}
          >
            Add Product
          </button>
        </form>

        {products.length === 0 ? (
          <div style={{ marginTop: 14, color: "#666" }}>No products yet. Add one above.</div>
        ) : (
          <ul className="product-list">
            {products.map((item) => (
              <li key={item.id} className="product-item">
                <div className="product-item-name">
                  {editingId === item.id ? (
                    <input
                      className="product-input"
                      style={{ padding: "8px 12px", marginTop: 0 }}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(item.id);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    item.name
                  )}
                </div>

                <div className="product-actions">
                  {editingId === item.id ? (
                    <>
                      <button
                        className="product-button product-button-primary"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={editingName.trim() === ""}
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        className="product-button product-button-neutral"
                        onClick={handleCancelEdit}
                        type="button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="product-button product-button-neutral"
                        onClick={() => handleStartEdit(item.id)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="product-button product-button-danger"
                        onClick={() => {
                          const ok = window.confirm(`Delete "${item.name}"?`);
                          if (!ok) return;
                          dispatch(deleteProduct(item.id));
                          if (editingId === item.id) handleCancelEdit();
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Product;