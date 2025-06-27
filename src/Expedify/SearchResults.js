import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchResults = () => {
  const location = useLocation();
  const { searchParams } = location.state || {};
  const { searchResults } = useSelector((state) => state.shipment);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Résultats de la recherche</h2>
      {searchResults.length === 0 ? (
        <p>Aucune expédition trouvée.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((shipment) => (
            <li key={shipment.id} className="bg-white p-4 shadow rounded">
              <p><strong>Pays de départ:</strong> {shipment.departure_country_name}</p>
              <p><strong>Pays d’arrivée:</strong> {shipment.arrival_country_name}</p>
              <p><strong>Type:</strong> {shipment.transport_type}</p>
              <p><strong>Poids:</strong> {shipment.weight} kg</p>
              <p><strong>Prix:</strong> {shipment.price} €</p>
              <p><strong>Date:</strong> {shipment.delivery_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
