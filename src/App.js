import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';

import './index.css';
import { store } from './Expedify/login/store'; 
import SearchResults from "./Expedify/RechercheCompagnie/ResultsPage";
import LoginForm from "./Expedify/login/loginForm";
import SignUp from "./Expedify/Exemple/signUp";

import Service from "./Expedify/Service";
import Accueil from "./Expedify/Acceuil";
import CompanyDetails from './Expedify/Admin/CompanyDetail';
import ForgotPassword from "./Expedify/forgotPassword/ForgotPassword";
import AdminDashboard from "./Expedify/Admin/adminDashboard";
import ProblemForm from "./Expedify/ProblemForm";
import ChippingPage from './Expedify/ChippingPage';
import CompanyList from './Expedify/CompanyList';
import SendPackage from './Expedify/SendPackage';
import DashboardCompany from "./Expedify/company/CompanyDashboard";
import OrderForm from "./Expedify/finalisation de commande/OrderForm";
import MyOrders from "./Expedify/finalisation de commande/myorders";
import OrderDetails from "./Expedify/finalisation de commande/orderDetail";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/results" element={<SearchResults/>} />
          <Route path="/orders/:id" element={<OrderForm/>} />
          <Route path="/send-package/:id" element={<SendPackage />} />
          <Route path="/company-dashboard" element={<DashboardCompany />} />
          <Route path="/shippingPage" element={<ChippingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/company-list" element={<CompanyList />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/admin/company/:id" element={<CompanyDetails />} />
          <Route path="/services" element={<Service />} />
          <Route path="/problem" element={<ProblemForm />} />
          <Route path="/orders" element={<MyOrders/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;



{/* <footer className="bg-gray-100 text-center p-4 mt-10">
        Projet Expedify &copy; 2025
      </footer> */}