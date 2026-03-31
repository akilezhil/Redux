import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "./productSlice";

const Product = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const handleAdd = () => {
    if (name.trim() !== "") {
      dispatch(addProduct(name));
      setName("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product App names</h2>

      <input
        type="text"
        placeholder="Enter product"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleAdd}>Add Product</button>

      <ul>
        {products.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Product;