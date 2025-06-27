import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Truck,
  Plane,
  Ship,
  Train,
  Package,
  FileText,
  Globe,
  Mail,
  Phone,
  Info,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIconComponent = (method) => {
    const iconClass = "w-4 h-4 mr-2";
    switch (method.toLowerCase()) {
      case 'routier':
        return <Truck className={`${iconClass} text-blue-600`} />;
      case 'aerien':
        return <Plane className={`${iconClass} text-sky-600`} />;
      case 'maritime':
        return <Ship className={`${iconClass} text-indigo-600`} />;
      case 'ferrovier':
        return <Train className={`${iconClass} text-purple-600`} />;
      default:
        return <Package className={`${iconClass} text-gray-500`} />;
    }
  };

  useEffect(() => {
  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/admin/company/${id}`);
      const data = response.data;

      // ✅ Si transport_methods est une string JSON, on la parse
      if (typeof data.transport_methods === 'string') {
        try {
          data.transport_methods = JSON.parse(data.transport_methods);
        } catch (parseError) {
          console.warn('Échec du parsing des transport_methods :', parseError);
          data.transport_methods = [];
        }
      }

      setCompany(data);
    } catch (error) {
      console.error("Erreur chargement des détails :", error);
      setError("Impossible de charger les détails de la société");
    } finally {
      setLoading(false);
    }
  };

  fetchCompany();
}, [id]);


  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-pulse flex flex-col items-center">
        <Package className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-400">Chargement des données...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!company) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-blue-50 p-3 rounded-lg mr-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">{company.company_name}</h1>
                <p className="text-gray-500 text-sm">Informations sur la société</p>
              </div>
            </div>
            {company.logo_path || company.logo_url ? (
              <div className="h-14 w-14 rounded-lg border border-gray-200 overflow-hidden bg-white">
                <img 
                  src={company.logo_path || company.logo_url} 
                  alt={`Logo ${company.company_name}`} 
                  className="h-full w-full object-contain p-1"
                />
              </div>
            ) : (
              <div className="h-14 w-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-3" />
                Informations de base
              </h2>
              <div className="space-y-4">
                <DetailItem 
                  icon={<Mail className="w-4 h-4 text-gray-500" />} 
                  label="Email" 
                  value={company.email} 
                />
                <DetailItem 
                  icon={<Phone className="w-4 h-4 text-gray-500" />} 
                  label="Téléphone" 
                  value={company.phone} 
                />
              </div>
            </div>

            {/* Activités */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <Globe className="w-5 h-5 text-blue-600 mr-3" />
                Activités
              </h2>
              <div className="space-y-4">
                <DetailItem 
                  icon={<Globe className="w-4 h-4 text-gray-500" />} 
                  label="Pays de livraison" 
                  value={company.delivery_country || 'Non spécifié'} 
                />
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                    <Truck className="w-4 h-4 text-gray-500 mr-2" />
                    Moyens de transport
                  </div>
                  <ul className="space-y-2 pl-6">
                    {Array.isArray(company.transport_methods) && company.transport_methods.length > 0 ? (
  company.transport_methods.map((method, index) => (
    <li key={index} className="flex items-center text-gray-600 text-sm">
      {getIconComponent(method)}
      <span className="capitalize">{method}</span>
    </li>
  ))
) : (
  <li className="text-gray-400 text-sm">Aucun moyen spécifié</li>
)}

                  </ul>
                </div>
                <DetailItem 
                  icon={<DollarSign className="w-4 h-4 text-gray-500" />} 
                  label="Politique des prix" 
                  value={company.pricing_policy || 'Non spécifiée'} 
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-3" />
                Description
              </h2>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {company.description || 'Aucune description fournie'}
                </p>
              </div>
            </div>

            {/* Fichier des conditions */}
            {company.terms_path && (
              <div className="md:col-span-2">
                <a 
                  href={`http://localhost:8000/storage/${company.terms_path}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Voir le fichier des conditions
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant réutilisable
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="ml-3">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-700 mt-0.5">{value || '-'}</p>
    </div>
  </div>
);

export default CompanyDetails;