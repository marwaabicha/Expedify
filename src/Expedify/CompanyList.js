import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant pour afficher et filtrer une liste de compagnies de transport
 * Permet aux utilisateurs de rechercher, filtrer et sélectionner des compagnies pour l'envoi de colis
 */
const CompanyList = () => {
  // Gestion d'état pour la liste des compagnies et les filtres
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    ratings: [],
    max_price: 1000,
    has_relay_points: '',
  });

  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  /**
   * Récupère les données des compagnies en fonction des filtres actuels
   * Gère la requête API avec des paramètres de requête dynamiques
   */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const params = new URLSearchParams();
        params.append('status', 'accepted');
        
        // Applique les filtres actifs aux paramètres de requête
        if (filters.name) params.append('name', filters.name);
        if (filters.max_price) params.append('max_price', filters.max_price);
        if (filters.has_relay_points !== '') params.append('has_relay_points', filters.has_relay_points);
        filters.ratings.forEach((r) => params.append('ratings[]', r));

        const response = await fetch(`http://localhost:8000/api/companies?${params.toString()}`, {
          headers: { Accept: 'application/json' },
        });

        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Erreur lors du chargement des compagnies:', error);
      }
    };

    fetchCompanies();
  }, [filters]);

  /**
   * Gère la sélection d'une compagnie avec vérification d'authentification
   * @param {number} companyId - ID de la compagnie sélectionnée
   */
  const handleSelect = (companyId) => {
  if (!isAuthenticated) {
    navigate('/login');
  } else {
    // Naviguer vers la page de formulaire de commande avec l'ID de la compagnie
    navigate(`/orders/${companyId}`);
  }
};

  /**
   * Gère les changements des inputs texte et select
   * @param {Object} e - Événement de changement
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Gère les changements des checkboxes pour le filtre des notes
   * @param {Object} e - Événement de changement
   */
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      ratings: checked
        ? [...prev.ratings, value]
        : prev.ratings.filter((r) => r !== value),
    }));
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* En-tête avec barre de recherche */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">Partenaires d'Expédition</h1>
          <p className="text-indigo-600">Trouvez le service de livraison parfait pour vos besoins</p>
        </div>
        
        <div className="w-full md:w-1/3">
          <label htmlFor="company-search" className="sr-only">Rechercher une compagnie</label>
          <div className="relative">
            <input
              id="company-search"
              type="text"
              name="name"
              placeholder="Rechercher une compagnie..."
              className="w-full border border-indigo-200 rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
              value={filters.name}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Section Filtres - Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800 border-b border-indigo-100 pb-2">Filtrer les résultats</h2>
            
            {/* Filtre par note */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-indigo-700 mb-2">Notes des clients</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((val) => (
                  <div key={val} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${val}`}
                      value={val}
                      checked={filters.ratings.includes(String(val))}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-indigo-300 rounded"
                    />
                    <label htmlFor={`rating-${val}`} className="ml-2 text-sm text-indigo-700 flex items-center">
                      {Array(val).fill().map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1">et plus</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtre par prix */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-indigo-700 mb-2">
                Prix maximum: <span className="font-bold text-purple-600">{filters.max_price} MAD</span>
              </h3>
              <input
                type="range"
                name="max_price"
                min="0"
                max="1000"
                step="50"
                value={filters.max_price}
                onChange={handleChange}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-indigo-500 mt-1">
                <span>0</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>

            {/* Filtre par points relais */}
            <div>
              <h3 className="text-sm font-medium text-indigo-700 mb-2">Points relais</h3>
              <select
                name="has_relay_points"
                value={filters.has_relay_points}
                onChange={handleChange}
                className="w-full border border-indigo-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-indigo-700"
              >
                <option value="">Toutes les options</option>
                <option value="1">Avec points relais</option>
                <option value="0">Sans points relais</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Section Principale - Liste des compagnies */}
        <main className="lg:w-3/4">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">Compagnies disponibles</h2>
          
          {companies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-indigo-100">
              <p className="text-indigo-500 mb-4">Aucune compagnie ne correspond à vos critères de recherche.</p>
              <button 
                onClick={() => setFilters({
                  name: '',
                  ratings: [],
                  max_price: 1000,
                  has_relay_points: '',
                })}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:from-purple-600 hover:to-indigo-700 shadow-md transition-all"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company) => (
                <article key={company.id} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-indigo-800">{company.company_name}</h3>
                    <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                      {company.rating} ★
                    </span>
                  </div>
                  
                  <ul className="space-y-2 mb-4 text-sm text-indigo-600">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prix minimum: <span className="font-semibold ml-1">{company.min_order_value} MAD</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Points relais: <span className="font-semibold ml-1">{company.has_relay_points ? 'Disponibles' : 'Non disponibles'}</span>
                    </li>
                  </ul>
                  
                  <button
                    onClick={() => handleSelect(company.id)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md"
                  >
                    Choisir ce partenaire
                  </button>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CompanyList;