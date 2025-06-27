import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], searchParams = {}, transportType = '' } = location.state || {};

  const isAuthenticated = !!localStorage.getItem("token");

  const parseTransportMethods = (str) => {
    try {
      const parsed = JSON.parse(str || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleSelect = (company) => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Veuillez vous connecter pour sélectionner une compagnie",
        },
      });
      return;
    }
    navigate(`/orders/${company.id}`, {
      state: { company, searchParams, transportType },
    });
  };

  if (!location.state) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Erreur de navigation
          </h3>
          <p className="text-gray-600 mb-6">
            Une erreur s'est produite lors de la navigation. Veuillez réessayer votre recherche.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(results)) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Format de données incorrect
          </h3>
          <p className="text-gray-600 mb-6">
            Les données reçues ne sont pas dans le format attendu. Veuillez réessayer.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Nouvelle recherche
          </button>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Aucun transporteur ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Nouvelle recherche
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Résultats de recherche</h2>

      {/* Affichage des paramètres de recherche */}
      {/* <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Vos critères</h3>
        <ul className="text-gray-600 space-y-1 text-sm">
          <li><strong>Pays de départ :</strong> {searchParams.from_country}</li>
          <li><strong>Pays d'arrivée :</strong> {searchParams.to_country}</li>
          <li><strong>Poids :</strong> {searchParams.weight} kg</li>
          <li><strong>Prix max :</strong> {searchParams.max_price ? `${searchParams.max_price} €` : 'Non spécifié'}</li>
          <li><strong>Type de transport :</strong> {transportType}</li>
        </ul>
      </div> */}

      {/* Affichage des résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{company.company_name}</h4>
            <p className="text-sm text-gray-600 mb-1">
  <strong>Trajet :</strong> {searchParams.from_country} → {searchParams.to_country}
</p>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Prix de commande :</strong> {company.min_order_value} €
            </p>
        <p className="text-sm text-gray-600 mb-2">
  <strong>Moyens de transport :</strong>
  {transportType || 'Non spécifiés'}
</p>

            <button
              onClick={() => handleSelect(company)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Choisir cette compagnie
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
