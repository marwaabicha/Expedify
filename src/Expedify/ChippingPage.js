import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShipmentPage() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    companyId: "",
    contact: "",
    phone: "",
    countryFrom: "",
    countryTo: "",
    cityFrom: "",
    cityTo: "",
    weight: "",
    service: "",
    freightType: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

 useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/companies");
      if (!response.ok) throw new Error("Erreur de chargement des compagnies");
      const data = await response.json();
      console.log("Données reçues :", data);
      
      const companiesList = Array.isArray(data)
        ? data
        : data && Array.isArray(data.data)
          ? data.data
          : [];

      setCompanies(companiesList.filter(c => c.status === "accepted"));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  fetchCompanies();
}, []);


  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value.toString(), // toujours convertir en string
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    

    try {
      const payload = {
        company_id: formData.companyId,
        contact: formData.contact,
        phone: formData.phone,
        country_from: formData.countryFrom,
        country_to: formData.countryTo,
        city_from: formData.cityFrom,
        city_to: formData.cityTo,
        weight: toString(formData.weight),
        service: formData.service,
        freight_type: formData.freightType,
      };

      const response = await fetch("http://localhost:8000/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la soumission");
      }

      setShowSuccess(true);
      // Réinitialiser le formulaire si nécessaire
      // setFormData({...});
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const freightTypeOptions = [
    { value: "aerien", label: "Aérien", icon: "✈️" },
    { value: "maritime", label: "Maritime", icon: "🚢" },
    { value: "routier", label: "Routier", icon: "🚛" },
    { value: "ferrovier", label: "Ferroviaire", icon: "🚂" }
  ];

  const serviceOptions = [
    { 
      value: "express", 
      label: "Express", 
      description: "Livraison en 24-48h",
      color: "bg-red-100 text-red-800"
    },
    { 
      value: "standard", 
      label: "Standard", 
      description: "Livraison en 3-5 jours",
      color: "bg-blue-100 text-blue-800"
    },
    { 
      value: "economique", 
      label: "Économique", 
      description: "Livraison en 7-10 jours",
      color: "bg-green-100 text-green-800"
    }
  ];

  const selectedCompany = companies.find(c => c.id == formData.companyId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 md:px-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-3">
          Demande d'Expédition
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Remplissez les informations pour envoyer vos marchandises en toute sécurité à travers le monde
        </p>
      </motion.header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Formulaire - Partie principale */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Barre de progression */}
            <div className="bg-gray-100 h-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Étape 1 - Informations de base */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Informations sur l'entreprise</h2>
                    
                    <div className="form-group">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Compagnie <span className="text-red-500">*</span>
  </label>
  <select
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    name="companyId"
    value={formData.companyId}
    onChange={handleChange}
    required
  >
    <option value="">-- Sélectionnez une compagnie --</option>
    {companies.map(company => (
      <option key={company.id} value={company.id}>
        {company.company_name || company.name}
      </option>
    ))}
  </select>
</div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Personne de contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Suivant
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 - Détails de l'expédition */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Détails de l'expédition</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pays d'origine <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="countryFrom"
                          value={formData.countryFrom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pays de destination <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="countryTo"
                          value={formData.countryTo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville de départ <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="cityFrom"
                          value={formData.cityFrom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville de destination <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          name="cityTo"
                          value={formData.cityTo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Poids estimé (kg) <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="number"
                        min="0.1"
                        step="0.1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Précédent
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Suivant
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3 - Options de service */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Options de service</h2>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de service <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {serviceOptions.map((service) => (
                          <motion.div 
                            key={service.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              id={service.value}
                              name="service"
                              value={service.value}
                              checked={formData.service === service.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            <label
                              htmlFor={service.value}
                              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.service === service.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="font-medium mb-1">{service.label}</div>
                              <div className="text-sm text-gray-600">{service.description}</div>
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de fret <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {freightTypeOptions.map((type) => (
                          <motion.div 
                            key={type.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              id={type.value}
                              name="freightType"
                              value={type.value}
                              checked={formData.freightType === type.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            <label
                              htmlFor={type.value}
                              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                                formData.freightType === type.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <div className="font-medium text-sm">{type.label}</div>
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Précédent
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          "Soumettre la demande"
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Résumé - Sidebar */}
        <div className="hidden md:block">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 text-white">
              <h2 className="text-xl font-semibold">Résumé de la demande</h2>
            </div>
            <div className="p-6">
              {formData.companyId ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {selectedCompany?.company_name || "Compagnie non spécifiée"}
                      </h3>
                      <p className="text-sm text-gray-600">{formData.contact}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Nouvelle demande
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Itinéraire:</span>
                      <span className="font-medium">
                        {formData.cityFrom || "?"} → {formData.cityTo || "?"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Pays:</span>
                      <span className="font-medium">
                        {formData.countryFrom || "?"} → {formData.countryTo || "?"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Poids:</span>
                      <span className="font-medium">
                        {formData.weight ? `${formData.weight} kg` : "?"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Service:</span>
                      {formData.service ? (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          serviceOptions.find(s => s.value === formData.service)?.color || ""
                        }`}>
                          {serviceOptions.find(s => s.value === formData.service)?.label || formData.service}
                        </span>
                      ) : (
                        <span>?</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fret:</span>
                      {formData.freightType ? (
                        <span className="flex items-center">
                          {freightTypeOptions.find(f => f.value === formData.freightType)?.icon || ""}
                          <span className="ml-1">
                            {freightTypeOptions.find(f => f.value === formData.freightType)?.label || formData.freightType}
                          </span>
                        </span>
                      ) : (
                        <span>?</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Votre demande sera traitée dans les plus brefs délais. Un conseiller vous contactera pour confirmer les détails.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Commencez à remplir le formulaire pour voir le résumé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de succès */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Demande envoyée !</h3>
              <p className="text-gray-600 mb-6">
                Votre demande d'expédition a été soumise avec succès. Notre équipe vous contactera sous peu.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}