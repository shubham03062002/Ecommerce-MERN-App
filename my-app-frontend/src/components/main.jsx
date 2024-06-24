import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="hero border-1 pb-3">
        <div className="card bg-dark text-white border-0 mx-3">
          <img
            className="card-img img-fluid"
            src="https://neilpatel.com/wp-content/uploads/2015/04/ecommerce.jpg "
            alt="Card"
            style={{ height: "500px" }}
            height={500}
          />
          <div className="card-img-overlay d-flex align-items-center">
            <div
              className="container"
              style={{
                marginTop: "350px",
                color: "aliceblue",
              }}
            >
              <h5 className="card-title fs-1 text fw-lighter">
                New Season Arrivals
              </h5>
              <p className="card-text fs-5 d-none d-sm-block">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This content is a little bit
                longer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
