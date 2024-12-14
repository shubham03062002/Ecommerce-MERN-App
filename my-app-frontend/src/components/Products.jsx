import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        console.log("Fetched products:", response.data);
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize with all products
      } catch (error) {
        console.error("Error fetching products:", error);
        setResponseMessage("Failed to load products. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category
  const filterProducts = (category) => {
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  // Function to add a product to the cart
  const addProductToCartAPI = async (product) => {
    try {
      const payload = {
        userId: localStorage.getItem("uid"), // Replace with actual user ID from your context/session
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1, // Or any other quantity if needed
          description: product.description,
          category: product.category
        },
        total: product.price // Assuming total is the price of a single item
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await axios.post("http://localhost:5000/cart/add", payload, { headers });
      setResponseMessage("Product added to cart successfully!");
      
      // Toast message on success
      toast.success("Product added to cart successfully!");

      console.log("Product added to cart:", response.data);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setResponseMessage("Failed to add product to cart.");
      
      // Toast message on error
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <div className="container">
      <h1>Product Catalog</h1>

      {/* Display the response message after adding a product */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => filterProducts("Men's Clothing")}>Men's Clothing</button>
        <button onClick={() => filterProducts("Women's Clothing")}>Women's Clothing</button>
        <button onClick={() => filterProducts("Jewelry")}>Jewelry</button>
        <button onClick={() => filterProducts("Electronics")}>Electronics</button>
        <button onClick={() => filterProducts("All")}>All</button>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addProductToCartAPI(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .filter-buttons button {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .filter-buttons button:hover {
          background-color: #0056b3;
        }
        .product-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          gap: 20px;
        }
        .product-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 250px;
          text-align: center;
          padding: 10px;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }
        .product-info {
          margin-top: 15px;
        }
        .product-info h3 {
          font-size: 1.2rem;
          font-weight: 600;
        }
        .product-info p {
          color: #555;
        }
        .add-to-cart-btn {
          background-color: #28a745;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        .add-to-cart-btn:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
};

export default App;
