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
import Categories from './pages/Categories'; // Import Categories
import CategoryDetails from './pages/CategoryDetails'; // Import CategoryDetails
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminMessages from './pages/AdminMessages';
import ProductCRUD from './pages/ProductCRUD';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Cart - Accessible to any logged-in user */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/login" element={<Login />} />
            <Route path="/login-admin" element={<AdminLogin />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/productcrud" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ProductCRUD />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
