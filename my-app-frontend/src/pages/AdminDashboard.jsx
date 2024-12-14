import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../pages/AdminNavbar';

const AdminDashboard = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productCategory, setProductCategory] = useState('');

  const navigate = useNavigate();

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/add-product', {
        title: productName,
        price: productPrice,
        description: productDescription,
        image: productImage,
        category: productCategory,
      });
      alert('Product added successfully');
      navigate("/productcrud");

      // Optionally, reset the form
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductImage('');
      setProductCategory('');
    } catch (error) {
      alert('Error adding product');
    }
  };

  return (
    <>      
      <AdminNavbar/>
      <div className="dashboard-container">
        <div className="form-container">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <h4 className="form-heading">Add a New Product</h4>
          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="productCategory" className="form-label">Category</label>
            <select
              className="form-control"
              id="productCategory"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Men's Clothing">Men's Clothing</option>
              <option value="Women's Clothing">Women's Clothing</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="productPrice" className="form-label">Product Price</label>
            <input
              type="number"
              className="form-control"
              id="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="productImage" className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              id="productImage"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>
          <button onClick={handleAddProduct} className="btn btn-primary">Add Product</button>
        </div>
      </div>

      <style>
        {`
          .dashboard-container {
            background-color: #f8f9fa;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .form-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
          }

          .dashboard-title {
            text-align: center;
            color: #343a40;
            margin-bottom: 20px;
            font-weight: bold;
          }

          .form-heading {
            color: #6c757d;
            margin-bottom: 15px;
            font-weight: 500;
          }

          .form-label {
            font-weight: 500;
            color: #495057;
          }

          .form-control {
            border-radius: 5px;
            border: 1px solid #ced4da;
            padding: 10px;
            transition: box-shadow 0.3s, border-color 0.3s;
          }

          .form-control:focus {
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 16px;
            transition: background-color 0.3s, transform 0.2s;
            width: 100%;
          }

          .btn-primary:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
          }

          .mb-3 {
            margin-bottom: 20px;
          }
        `}
      </style>
    </>
  );
};

export default AdminDashboard;
