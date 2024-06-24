import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './AuthContext'; // Import your AuthProvider
import store from './redux/store';

import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import Products from './pages/Products';
import Product from './pages/Product';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import PageNotFound from './pages/PageNotFound';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider> {/* Wrap your application with AuthProvider */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
