import React, { useState } from 'react';
import axios from 'axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/categories', { name, description });
      if (response.status === 201) {
        toastr.success('Category added successfully!');
        setName('');
        setDescription('');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add category';
      toastr.error(errorMsg);
      setMessage(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Category</h2>
      <form onSubmit={handleAddCategory}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Category Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Add Category</button>
      </form>
      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
};

export default AddCategory;
