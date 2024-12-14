import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const addProduct = async (product) => {
    console.log("Attempting to add product:", product);
    try {
      const userId = "6755b41a585d169672fefc18";

      // Construct payload exactly as required
      const payload = {
        userId,
        product: {
          title: product.title,
          price: product.price,
          qty: 1, // Default quantity
          image: product.image,
          description: product.description,
          category: product.category,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/cart/add/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 200 || response.status === 201) {
        console.log("Cart updated successfully:", response.data);
      } else {
        console.error(
          "Failed to add product to cart:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        // Fetch product details
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch product with ID ${id}`);
        const data = await response.json();
        console.log("Product data:", data);
        setProduct(data);

        // Fetch similar products by category
        const response2 = await fetch(
          `https://fakestoreapi.com/products/category/${data.category}`
        );
        if (!response2.ok) throw new Error(`Failed to fetch similar products for category ${data.category}`);
        const data2 = await response2.json();
        console.log("Similar products:", data2);
        setSimilarProducts(data2);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
        setLoading2(false);
      }
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 py-3">
            <Skeleton height={400} width={400} />
          </div>
          <div className="col-md-6 py-5">
            <Skeleton height={30} width={250} />
            <Skeleton height={90} />
            <Skeleton height={40} width={70} />
            <Skeleton height={50} width={110} />
            <Skeleton height={120} />
            <Skeleton height={40} width={110} inline={true} />
            <Skeleton className="mx-3" height={40} width={110} />
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    if (!product || Object.keys(product).length === 0) {
      return <div>No product found!</div>;
    }

    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={product.image}
              alt={product.title}
              width="400px"
              height="400px"
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{product.category}</h4>
            <h1 className="display-5">{product.title}</h1>
            <p className="lead">
              {product.rating && product.rating.rate}{" "}
              <i className="fa fa-star"></i>
            </p>
            <h3 className="display-6 my-4">${product.price}</h3>
            <p className="lead">{product.description}</p>
            <button
              className="btn btn-outline-dark"
              onClick={() => addProduct(product)}
            >
              Add to Cart
            </button>
            <Link to="/cart" className="btn btn-dark mx-3">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowSimilarProduct = () => {
    if (!similarProducts || similarProducts.length === 0) {
      return <div>No similar products found!</div>;
    }

    return (
      <div className="py-4 my-4">
        <div className="d-flex">
          {similarProducts.map((item) => (
            <div key={item.id} className="card mx-4 text-center">
              <img
                className="card-img-top p-3"
                src={item.image}
                alt="Card"
                height={300}
                width={300}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {item.title.substring(0, 15)}...
                </h5>
                <div className="card-body">
                  <Link
                    to={`/product/${item.id}`}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => addProduct(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
              {loading2 ? <Loading /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
