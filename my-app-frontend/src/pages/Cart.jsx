import React, { useEffect, useState } from "react";
import axios from "axios";
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uid1 = localStorage.getItem("uid"); // User ID from local storage

  useEffect(() => {
    if (!uid1) {
      setError("You need to log in to view your cart.");
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/cart/${uid1}`);
        console.log("User ID:", uid1); // Debugging User ID
        const products = response.data.products || [];
        setCartProducts(products);
        localStorage.setItem("cart", JSON.stringify(products));
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [uid1]);

  const updateCartInLocalStorage = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateProductQty = (productId, qtyChange) => {
    setCartProducts((prevProducts) => {
      const updatedCart = prevProducts.map((item) =>
        item._id === productId
          ? { ...item, qty: item.qty + qtyChange }
          : item
      );

      updateCartInLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const addItem = async (product) => {
    console.log("Payload to backend:", {
      userId: uid1,
      product: { ...product, qty: 1 },
    }); // Log payload to debug

    try {
      console.log("frontend userid while adding to cart :",uid1)
      await axios.post("http://localhost:5000/cart/add", {
        userId:uid1,
        product: { ...product, qty: 1 },
      });
      updateProductQty(product._id, 1);
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError("Failed to update cart. Please try again.");
    }
  };

  const removeItem = async (product) => {
    try {
      await axios.put(`http://localhost:5000/cart/${uid1}/${product._id}`, {
        qtyChange: -1,
      });
      updateProductQty(product._id, -1);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError("Failed to update cart. Please try again.");
    }
  };

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">Your Cart is Empty</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    cartProducts.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Item List</h5>
                </div>
                <div className="card-body">
                  {cartProducts.map((item) => (
                    <div key={item._id}>
                      <div className="row d-flex align-items-center">
                        <div className="col-lg-3 col-md-12">
                          <img
                            src={item.image}
                            alt={item.title}
                            width={100}
                            height={75}
                            className="bg-image rounded"
                          />
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <p>
                            <strong>{item.title}</strong>
                          </p>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                            <button className="btn px-3" onClick={() => removeItem(item)}>
                              <i className="fas fa-minus"></i>
                            </button>
                            <p className="mx-5">{item.qty}</p>
                            <button className="btn px-3" onClick={() => addItem(item)}>
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <p className="text-start text-md-center">
                            <strong>
                              <span className="text-muted">{item.qty}</span> x ${item.price}
                            </strong>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})
                      <span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                  <Link
                    to={{
                      pathname: "/checkout",
                      state: { cartItems: cartProducts },
                    }}
                    className="btn btn-dark btn-lg btn-block"
                  >
                    Go to checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar />
      <div
        className="container my-3 py-3"
        style={{ background: "linear-gradient(45deg, #e26565, transparent)" }}
      >
        <h1 className="text-center">Cart</h1>
        <hr />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : cartProducts.length > 0 ? (
          <ShowCart />
        ) : (
          <EmptyCart />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
