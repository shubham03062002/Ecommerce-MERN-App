import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const CategoryDetails = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch category details
  useEffect(() => {
    axios.get(`http://localhost:5000/category/${id}`)
      .then(response => setCategory(response.data))
      .catch(error => console.error('Error fetching category details:', error));

    // Fetch products in the category
    axios.get(`http://localhost:5000/category/${id}/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, [id]);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/product/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`http://localhost:5000/product/${editingProduct._id}`, editingProduct);
      setProducts(products.map(product => 
        product._id === editingProduct._id ? editingProduct : product
      ));
      setEditingProduct(null);
      alert('Product updated successfully');
    } catch (error) {
      alert('Error updating product');
    }
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="container">
        <h1>{category.name}</h1>
        <p>{category.description || 'No description available.'}</p>

        <h3>Products</h3>
        <div className="row">
          {products.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingProduct(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      id="title"
                      className="form-control"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      className="form-control"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                      type="number"
                      id="price"
                      className="form-control"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleEditProduct}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryDetails;
