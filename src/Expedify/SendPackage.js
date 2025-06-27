import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SendPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [price, setPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sender_name: '',
    receiver_name: '',
    origin_country: '',
    destination_country: '',
    weight: '',
    transport_method: '',
    payment_method: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchCompany();
    }
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      const data = await res.json();
      setCompany(data);
    } catch (error) {
      console.error('Erreur lors du chargement de la compagnie', error);
    }
  };

  useEffect(() => {
    if (formData.weight && company?.pricing_policy?.price_per_kg) {
      const weight = parseFloat(formData.weight);
      const rate = parseFloat(company.pricing_policy.price_per_kg);
      setPrice(weight * rate);
    } else {
      setPrice(0);
    }
  }, [formData.weight, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`http://localhost:8000/api/send-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          company_id: id,
        }),
      });

      if (res.ok) {
        navigate('/confirmation', { state: { 
          companyName: company.company_name,
          trackingNumber: `TRK-${Math.floor(Math.random() * 1000000)}`,
          price: price.toFixed(2)
        }});
      } else {
        const data = await res.json();
        alert(`Erreur : ${data.message || "Une erreur s'est produite"}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du colis', error);
      alert("Une erreur s'est produite lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!company) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-2">
            Envoi de colis avec <span className="text-purple-600">{company.company_name}</span>
          </h1>
          <p className="text-lg text-indigo-600">
            Remplissez les détails de votre envoi ci-dessous
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expéditeur */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Expéditeur</label>
                  <input
                    name="sender_name"
                    placeholder="Nom complet"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Destinataire */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Destinataire</label>
                  <input
                    name="receiver_name"
                    placeholder="Nom complet"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Origine */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Pays d'origine</label>
                  <input
                    name="origin_country"
                    placeholder="France"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Pays de destination</label>
                  <input
                    name="destination_country"
                    placeholder="Belgique"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Poids */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Poids (kg)</label>
                  <div className="relative">
                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="2.5"
                      className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      onChange={handleChange}
                      required
                    />
                    <span className="absolute right-4 top-3 text-indigo-400">kg</span>
                  </div>
                </div>

                {/* Mode de transport */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Mode de transport</label>
                  <select 
                    name="transport_method" 
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Sélectionnez...</option>
                    {company?.transport_methods?.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {/* Méthode de paiement */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-700">Méthode de paiement</label>
                  <select
                    name="payment_method"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez...</option>
                    {company && Object.entries(company.payment_methods || {}).map(([method, enabled]) => (
                      enabled && <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-8 px-6 py-3 rounded-xl font-bold text-white transition-all ${isSubmitting 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : 'Confirmer l\'envoi'}
              </button>
            </form>
          </div>

          {/* Résumé */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 h-fit sticky top-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-6 pb-2 border-b border-indigo-100">Résumé de votre envoi</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-indigo-600">Transporteur:</span>
                <span className="font-medium">{company.company_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-indigo-600">Expéditeur:</span>
                <span className="font-medium">{formData.sender_name || '---'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-indigo-600">Destinataire:</span>
                <span className="font-medium">{formData.receiver_name || '---'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-indigo-600">Trajet:</span>
                <span className="font-medium">
                  {formData.origin_country || '---'} → {formData.destination_country || '---'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-indigo-600">Poids:</span>
                <span className="font-medium">{formData.weight || '0'} kg</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-indigo-600">Service:</span>
                <span className="font-medium">{formData.transport_method || '---'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-indigo-600">Paiement:</span>
                <span className="font-medium">{formData.payment_method || '---'}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-700">Total:</span>
                  <span className="text-2xl font-bold text-purple-600">{price.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-indigo-600">
                  Le prix final peut varier en fonction des taxes et frais supplémentaires applicables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPackage;