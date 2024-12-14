import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductCRUD.css";
import AdminNavbar from "./AdminNavbar";

const ProductCRUD = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or update a product
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update product
        await axios.put(`http://localhost:5000/api/products/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Add product
        await axios.post("http://localhost:5000/api/products", formData);
      }

      setFormData({ title: "", category: "", price: "", description: "", image: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Set form for editing
  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
  };

  return (
    <>      <AdminNavbar/>
    <div className="container">
      <h1 className="heading">Product Management</h1>
      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="text"
          placeholder="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="text"
          placeholder="Image URL"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          className="input"
        />
        <button type="submit" className="button">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2 className="sub-heading">Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="product-row">
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>
                <img src={product.image} alt={product.title} className="product-image" />
              </td>
              <td>
                <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>

  );
};

export default ProductCRUD;
