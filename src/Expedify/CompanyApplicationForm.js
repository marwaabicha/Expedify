import React, { useState ,useEffect} from 'react';
import axios from "axios";
import { 
  Upload, 
  Check, 
  Globe, 
  Truck, 
  Ship, 
  Plane, 
  Train, 
  CreditCard, 
  Landmark, 
  WalletCards,
  Smartphone, 
  Mail, 
  User,
  Phone, 
  MapPin,
  Building,
  FileDigit,
  FileText,
  CircleDollarSign,
} from 'lucide-react';
const CompanyApplicationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    useLogoUrl: false,
    logoFile: null,
    logoUrl: '',
    minOrderValue: '',
    deliveryCountry: [],
    transportMethods: {
      routier: false,
      maritime: false,
      aerien: false,
      ferrovier: false,
    },
    termsFile: null,
    paymentMethods: {
      creditCard: false,
      paypal: false,
      bankTransfer: false,
      cashOnDelivery: false,
      mobilePayment: false,
    },
    contact: {
      email: '',
      phone: '',
      website: '',
      address: '',
    },
    acceptedTerms: false,
    acceptedPrivacyPolicy: false,
  });

  const [countryOptions, setCountryOptions] = useState([]);

  // Charger les pays depuis l'API publique
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then((res) => {
        // Extraire et trier les noms des pays
        const countries = res.data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));

        setCountryOptions(countries);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des pays :", err);
      });
  }, []);

  const handleToggleCountry = (country) => {
    if (country === 'all') {
      // Si tous les pays sont déjà sélectionnés, on désélectionne tout
      if (formData.deliveryCountry.length === countryOptions.length) {
        setFormData({ ...formData, deliveryCountry: [] });
      } else {
        // Sinon on sélectionne tous les pays
        setFormData({ ...formData, deliveryCountry: [...countryOptions] });
      }
      return;
    }

    let updated = [...formData.deliveryCountry];
    if (updated.includes(country)) {
      updated = updated.filter(c => c !== country);
    } else {
      updated.push(country);
    }
    setFormData({ ...formData, deliveryCountry: updated });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.transportMethods) {
      setFormData({
        ...formData,
        transportMethods: {
          ...formData.transportMethods,
          [name]: checked,
        }
      });
    } else if (name in formData.paymentMethods) {
      setFormData({
        ...formData,
        paymentMethods: {
          ...formData.paymentMethods,
          [name]: checked,
        }
      });
    } else if (['email', 'phone', 'website', 'address'].includes(name)) {
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          [name]: value,
        }
      });
    } else if (type === 'checkbox' && (name === 'acceptedTerms' || name === 'acceptedPrivacyPolicy' || name === 'useLogoUrl')) {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (!formData.companyName || !formData.description) {
      alert("Nom et description de la compagnie sont obligatoires");
      return;
    }
    if (!formData.acceptedTerms || !formData.acceptedPrivacyPolicy) {
      alert("Vous devez accepter les conditions et la politique de confidentialité");
      return;
    }
    if (!formData.contact.email) {
      alert("Email requis");
      return;
    }
    if (formData.deliveryCountry.length === 0) {
      alert("Veuillez sélectionner au moins un pays de livraison");
      return;
    }

    try {
      // Créer l'objet de données à envoyer
      const formDataToSend = new FormData();
      
      // Informations de base
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('minOrderValue', formData.minOrderValue);
      
      // Pays de livraison - envoyé comme JSON string pour préserver le tableau
      formDataToSend.append('deliveryCountry', JSON.stringify(formData.deliveryCountry));

      // Logo
      if (formData.useLogoUrl && formData.logoUrl) {
        formDataToSend.append('logoUrl', formData.logoUrl);
      } else if (formData.logoFile) {
        formDataToSend.append('logoFile', formData.logoFile);
      }

      // Méthodes de transport
      const selectedTransports = Object.entries(formData.transportMethods)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      formDataToSend.append('transportMethods', JSON.stringify(selectedTransports));

      // Fichier des termes
      if (formData.termsFile) {
        formDataToSend.append('termsFile', formData.termsFile);
      }

      // Méthodes de paiement
      formDataToSend.append('paymentMethods', JSON.stringify(formData.paymentMethods));

      // Informations de contact
      formDataToSend.append('email', formData.contact.email);
      formDataToSend.append('phone', formData.contact.phone);
      if (formData.contact.website) formDataToSend.append('website', formData.contact.website);
      if (formData.contact.address) formDataToSend.append('address', formData.contact.address);

      // Acceptation des conditions
      formDataToSend.append('acceptedTerms', formData.acceptedTerms ? '1' : '0');
      formDataToSend.append('acceptedPrivacyPolicy', formData.acceptedPrivacyPolicy ? '1' : '0');

      const res = await fetch('http://localhost:8000/api/companies', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi du formulaire");
      }

      alert("Demande envoyée avec succès !");
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert(err.message || "Une erreur est survenue lors de l'envoi du formulaire");
    }
  };

   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête élégant avec ombre portée */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Devenez Partenaire <span className="text-blue-600">Logistique</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez notre réseau exclusif de prestataires logistiques et développez votre activité
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Barre de progression */}
          <div className="h-2 bg-gray-100">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-700" style={{ width: '100%' }}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
  {/* Section Informations Entreprise */}
  <div className="space-y-6 p-6 border border-gray-100 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
    <div className="flex items-center mb-6">
      <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 mr-4">
        <Building className="text-blue-600" size={20} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">
        Informations de l'Entreprise
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <User className="mr-2 text-blue-500" size={16} />
          Nom de la compagnie *
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          placeholder="Ex: TransLogistics International"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <CircleDollarSign className="mr-2 text-blue-500" size={16} />
          Valeur minimale de commande
        </label>
        <div className="relative">
          <input
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="0.00"
          />
          <span className="absolute left-3 top-3 text-gray-400">$</span>
        </div>
      </div>
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <FileText className="mr-2 text-blue-500" size={16} />
        Description *
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        required
        placeholder="Décrivez votre entreprise en quelques mots..."
      />
    </div>

    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <FileDigit className="mr-2 text-blue-500" size={16} />
        Logo de l'entreprise
      </label>
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="useLogoUrl"
            checked={formData.useLogoUrl}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Utiliser une URL</span>
        </label>
      </div>

      {formData.useLogoUrl ? (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Globe className="text-gray-400" size={16} />
          </div>
          <input
            type="url"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      ) : (
        <div className="mt-2 flex items-center space-x-4">
          <label className="cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center">
            <Upload className="mr-2" size={16} />
            Choisir un fichier
            <input
              type="file"
              name="logoFile"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {formData.logoFile && (
            <span className="text-sm text-gray-600 flex items-center">
              <Check className="text-green-500 mr-1" size={16} />
              {formData.logoFile.name}
            </span>
          )}
        </div>
      )}
    </div>
  </div>

  {/* Section Logistique */}
  <div className="space-y-6 p-6 border border-gray-100 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
    <div className="flex items-center mb-6">
      <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 mr-4">
        <Truck className="text-blue-600" size={20} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">
        Informations Logistiques
      </h2>
    </div>
<div>
  <div className="space-y-4">
  {/* Résultat actuel */}
  <div className="text-sm text-gray-600">
    <strong>Pays de livraison : </strong>
    {formData.deliveryCountry.length > 0
      ? formData.deliveryCountry.join(', ')
      : 'Non spécifié'}
  </div>
</div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Globe className="w-4 h-4 mr-2 text-blue-500" />
          Pays de livraison
        </label>
        <button
          type="button"
          onClick={() => handleToggleCountry('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            formData.deliveryCountry.length === countryOptions.length
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {formData.deliveryCountry.length === countryOptions.length ? 'Désélectionner tout' : 'Sélectionner tout'}
        </button>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-3 border border-gray-200 rounded-lg shadow-sm">
          {countryOptions.map((country) => {
            const isSelected = formData.deliveryCountry.includes(country);
            return (
              <button
                type="button"
                key={country}
                onClick={() => handleToggleCountry(country)}
                className={`flex items-center justify-between p-2 rounded-md text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
              >
                <span className="truncate">{country}</span>
                {isSelected && (
                  <Check className="ml-1.5 w-3.5 h-3.5 text-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
        <p>Sélectionnez un ou plusieurs pays en cliquant dessus.</p>
        <p>{formData.deliveryCountry.length} pays sélectionnés</p>
      </div>
    </div>

    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <Truck className="mr-2 text-blue-500" size={16} />
        Moyens de transport *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { value: 'routier', icon: <Truck size={18} />, label: 'Routier', color: 'bg-blue-100 text-blue-700' },
          { value: 'maritime', icon: <Ship size={18} />, label: 'Maritime', color: 'bg-indigo-100 text-indigo-700' },
          { value: 'aerien', icon: <Plane size={18} />, label: 'Aérien', color: 'bg-sky-100 text-sky-700' },
          { value: 'ferrovier', icon: <Train size={18} />, label: 'Ferroviaire', color: 'bg-cyan-100 text-cyan-700' }
        ].map(({ value, icon, label, color }) => (
          <label key={value} className={`flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition ${formData.transportMethods[value] ? color : ''}`}>
            <input
              type="checkbox"
              name={value}
              checked={formData.transportMethods[value]}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="flex items-center text-sm font-medium">
              <span className="mr-2">{icon}</span>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <FileText className="mr-2 text-blue-500" size={16} />
        Fichier des termes et conditions *
      </label>
      <div className="flex items-center space-x-4">
        <label className="cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center">
          <Upload className="mr-2" size={16} />
          Choisir un fichier
          <input
            type="file"
            name="termsFile"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            required
          />
        </label>
        {formData.termsFile && (
          <span className="text-sm text-gray-600 flex items-center">
            <Check className="text-green-500 mr-1" size={16} />
            {formData.termsFile.name}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (max 5MB)</p>
    </div>
  </div>

  {/* Section Paiement */}
  <div className="space-y-6 p-6 border border-gray-100 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
    <div className="flex items-center mb-6">
      <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 mr-4">
        <CircleDollarSign className="text-blue-600" size={20} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">
        Méthodes de Paiement
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { value: 'creditCard', icon: <CreditCard size={16} />, label: 'Carte de crédit', color: 'text-blue-600' },
        { value: 'paypal', icon: <WalletCards size={16} />, label: 'PayPal', color: 'text-indigo-600' },
        { value: 'bankTransfer', icon: <Landmark size={16} />, label: 'Virement bancaire', color: 'text-green-600' },
        { value: 'cashOnDelivery', icon: <CircleDollarSign size={16} />, label: 'Paiement à la livraison', color: 'text-amber-600' },
        { value: 'mobilePayment', icon: <Smartphone size={16} />, label: 'Paiement mobile', color: 'text-purple-600' }
      ].map(({ value, icon, label, color }) => (
        <label key={value} className={`flex items-center space-x-3 p-3 border ${formData.paymentMethods[value] ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} rounded-lg hover:bg-gray-50 cursor-pointer transition`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formData.paymentMethods[value] ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {React.cloneElement(icon, { className: `${formData.paymentMethods[value] ? 'text-blue-600' : color}`, size: 16 })}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          <input
            type="checkbox"
            name={value}
            checked={formData.paymentMethods[value]}
            onChange={handleChange}
            className="ml-auto h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </label>
      ))}
    </div>
  </div>

  {/* Section Contact */}
  <div className="space-y-6 p-6 border border-gray-100 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
    <div className="flex items-center mb-6">
      <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 mr-4">
        <Mail className="text-blue-600" size={20} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">
        Contact
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <Mail className="mr-2 text-blue-500" size={16} />
          Email *
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.contact.email}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            placeholder="contact@entreprise.com"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <Phone className="mr-2 text-blue-500" size={16} />
          Téléphone *
        </label>
        <div className="relative">
          <input
            type="tel"
            name="phone"
            value={formData.contact.phone}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            placeholder="+33 6 12 34 56 78"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <Globe className="mr-2 text-blue-500" size={16} />
          Site web
        </label>
        <div className="relative">
          <input
            type="url"
            name="website"
            value={formData.contact.website}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://www.entreprise.com"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Globe className="text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <MapPin className="mr-2 text-blue-500" size={16} />
          Adresse
        </label>
        <div className="relative">
          <input
            type="text"
            name="address"
            value={formData.contact.address}
            onChange={handleChange}
            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="123 Rue des Entreprises, 75000 Paris"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="text-gray-400" size={16} />
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Conditions */}
  <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-100">
    <div className="flex items-start">
      <div className="flex items-center h-5 mt-0.5">
        <input
          type="checkbox"
          name="acceptedTerms"
          checked={formData.acceptedTerms}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700">J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a> de la plateforme *</label>
        <p className="text-gray-500 mt-1">En cochant cette case, vous acceptez les termes du contrat de partenariat.</p>
      </div>
    </div>

    <div className="flex items-start">
      <div className="flex items-center h-5 mt-0.5">
        <input
          type="checkbox"
          name="acceptedPrivacyPolicy"
          checked={formData.acceptedPrivacyPolicy}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700">J'accepte la <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a> de la plateforme *</label>
        <p className="text-gray-500 mt-1">Nous nous engageons à protéger vos données personnelles.</p>
      </div>
    </div>
  </div>

  {/* Bouton de soumission */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
    <p className="text-sm text-gray-500">
      * Champs obligatoires
    </p>
    <button
      type="submit"
      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02]"
    >
      Soumettre la demande
      <Check className="inline ml-2" size={18} />
    </button>
  </div>
</form>
</div>
</div>
</div>
   );
  };

export default CompanyApplicationForm;