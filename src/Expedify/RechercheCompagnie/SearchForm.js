import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plane, Ship, Train, Search } from 'lucide-react';

const SearchForm = () => {
  const [searchParams, setSearchParams] = useState({
    from_country: '',
    to_country: '',
    weight: '',
    max_price: '',
    transport_type:'',
  });
  const [transportType, setTransportType] = useState('routier');
  const navigate = useNavigate();

  const transportTypes = [
    { value: 'routier', label: 'Routier', icon: <Truck size={18} /> },
    { value: 'maritime', label: 'Maritime', icon: <Ship size={18} /> },
    { value: 'aerien', label: 'Aérien', icon: <Plane size={18} /> },
    { value: 'ferroviaire', label: 'Ferroviaire', icon: <Train size={18} /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const params = { 
    ...searchParams,
    transport_type: transportType
  };

  console.log('Params:', params);

  try {
   const res = await fetch('http://localhost:8000/api/search-companies', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({ 
    ...searchParams,
    transport_type: transportType 
  }),
});


    const data = await res.json();
    console.log('Response:', data);

    if (!data || data.length === 0) {
      alert('Aucun résultat trouvé avec ces critères.');
      return; // Ne pas naviguer si aucun résultat
    }

    navigate('/results', { state: { results: data, searchParams: params, transportType } });

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Une erreur est survenue lors de la récupération des résultats. Veuillez réessayer.');
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 -mt-32 rounded-2xl">
      <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
        {/* Onglets pour les types de transport */}
        <div className="#FFFAFA p-4 rounded-t-2xl shadow-sm">
          <div className="flex flex-wrap justify-center gap-2">
            {transportTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`px-6 py-2 rounded-full font-bold text-sm sm:text-base ${
                  transportType === type.value
                    ? "bg-blue-400 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } transition-colors duration-200`}
                onClick={() => setTransportType(type.value)}
                aria-label={`Sélectionner ${type.label}`}
              >
                <span className="flex items-center">
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Pays de départ */}
            <div className="space-y-1">
              <label htmlFor="from_country" className="block text-sm font-medium text-gray-700">
                Pays de départ *
              </label>
              <input
                id="from_country"
                name="from_country"
                type="text"
                value={searchParams.from_country}
                onChange={handleInputChange}
                placeholder="France"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            {/* Pays d'arrivée */}
            <div className="space-y-1">
              <label htmlFor="to_country" className="block text-sm font-medium text-gray-700">
                Pays d'arrivée *
              </label>
              <input
                id="to_country"
                name="to_country"
                type="text"
                value={searchParams.to_country}
                onChange={handleInputChange}
                placeholder="Allemagne"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            {/* Poids */}
            <div className="space-y-1">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Poids (kg) *
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={searchParams.weight}
                onChange={handleInputChange}
                placeholder="5.0"
                min="0"
                step="0.1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            {/* Prix max */}
            <div className="space-y-1">
              <label htmlFor="max_price" className="block text-sm font-medium text-gray-700">
                Prix max (€)
              </label>
              <input
                id="max_price"
                name="max_price"
                type="number"
                value={searchParams.max_price}
                onChange={handleInputChange}
                placeholder="100.00"
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Search className="mr-2" size={18} />
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;