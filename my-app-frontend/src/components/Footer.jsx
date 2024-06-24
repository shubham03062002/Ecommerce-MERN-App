import React from "react";

const Footer = () => {
  return (
    <>
      <footer
        className="text-center"
        style={{
          background: "linear-gradient(45deg, #9189e2, transparent)",
          padding: "25px 0",
        }}
      >
        <div className="container d-flex align-items-center justify-content-center">
          <div className="col-md-6 text-center">
            <p className="mb-3 mb-md-0" style={{ fontSize: "larger" }}>
              Made with ❤️ by Shubham Asawale
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
