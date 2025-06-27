import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderForm = () => {
  // Hooks

  const navigate = useNavigate();
const location = useLocation();
const { state } = location || {};
 const token = localStorage.getItem("authToken");

  // State
  const [form, setForm] = useState({
    recipientName: "",
    paymentMethod: ""
  });
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Data
  const { company, searchParams, transportType } = state || {};
  const { recipientName, paymentMethod } = form;

  // Effects
 useEffect(() => {
  if (!company || !company.payment_methods) return;

  const loadPaymentMethods = () => {
    let methods = company.payment_methods || [];
    // Vérifiez si methods est un tableau ou un objet
    if (typeof methods === "object" && !Array.isArray(methods)) {
      methods = Object.keys(methods).filter(key => methods[key]);
    }
    setPaymentOptions(methods);
    
    if (methods.length > 0 && !paymentMethod) {
      setForm(prev => ({ ...prev, paymentMethod: methods[0] }));
    }
  };

  loadPaymentMethods();
}, [company, paymentMethod]);


  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    if (!company?.min_order_value) {
      throw new Error("Le prix estimé est requis");
    }

    const response = await createOrder();
    const orderId = response.data.id;  // supposons que l'API retourne { id: ..., ... }

    // Naviguer vers la page orderDetails avec l'ID de la commande
    navigate(`/orderDetails/${orderId}`);

  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setIsSubmitting(false);
  }
};





  const createOrder = async () => {
    const token = localStorage.getItem("authToken");
    
    await axios.post(
      `${process.env.REACT_APP_API_URL}/orders`,
      {
        company_id: company.id,
        ...searchParams,
        estimated_price: company.min_order_value,
        transport_type: transportType,
        recipient_name: recipientName,
        payment_method: paymentMethod,
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  };

  // Early return
  if (!company || !searchParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Données incomplètes</h2>
          <p className="text-gray-600 mb-6">
            Les informations nécessaires ne sont pas disponibles. Veuillez revenir à la page de recherche.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light text-gray-900 mb-2">Finalisation de commande</h1>
      <p className="text-gray-500 mb-8">{company.company_name}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
              Informations requises
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ReadOnlyField 
                  key="from_country"
                  label="Pays de départ" 
                  value={searchParams.from_country} 
                />

                <ReadOnlyField 
                  label="Pays d'arrivée" 
                  value={searchParams.to_country} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ReadOnlyField 
                  label="Poids (kg)" 
                  value={searchParams.weight} 
                />
                <ReadOnlyField 
                  label="Prix estimé" 
                  value={`${company.min_order_value?.toLocaleString() ?? "N/A"} €`} 
                />

              </div>

              <ReadOnlyField 
                label="Type de transport" 
                value={transportType} 
              />

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du destinataire *
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={recipientName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de paiement *
                </label>
                <select
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                >
                  {paymentOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatPaymentMethod(option)}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </>
                ) : "Confirmer la commande"}
              </button>
            </form>
          </div>
        </div>

        {/* Summary Section */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
              Récapitulatif
            </h2>

            <div className="space-y-4">
              <SummaryItem 
                label="Compagnie" 
                value={company.company_name} 
              />
              <SummaryItem 
                label="Type de transport" 
                value={transportType} 
              />
              <SummaryItem 
                label="Trajet" 
                value={`${searchParams.from_country} → ${searchParams.to_country}`} 
              />
              <SummaryItem 
                label="Poids" 
                value={`${searchParams.weight} kg`} 
              />
              <SummaryItem 
                label="Prix estimé" 
                value={`${company.min_order_value?.toLocaleString() ?? "N/A"} €`} 
              />

              <SummaryItem 
                label="Destinataire" 
                value={recipientName || "Non spécifié"} 
                highlight={!!recipientName}
              />
              <SummaryItem 
                label="Méthode de paiement" 
                value={paymentMethod ? formatPaymentMethod(paymentMethod) : "Non sélectionnée"} 
              />
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-xl font-light text-gray-900">
                  {company.min_order_value?.toLocaleString() ?? "N/A"} €
                </span>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
      {value}
    </div>
  </div>
);

const SummaryItem = ({ label, value, highlight = false }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className={`${highlight ? "font-medium text-blue-600" : "text-gray-700"}`}>
      {value}
    </span>
  </div>
);

// Utils
const formatPaymentMethod = (method) => {
  const methods = {
    credit_card: "Carte de crédit",
    paypal: "PayPal",
    bank_transfer: "Virement bancaire",
    cash: "Espèces"
  };
  return methods[method] || method.split('_').join(' ').toUpperCase();
};

export default OrderForm;