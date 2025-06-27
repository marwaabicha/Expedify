import React, { useEffect, useState } from 'react';

function ShipmentsSummary() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:8000/api/company-shipments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la récupération des expéditions');
      return res.json();
    })
    .then(data => {
      setShipments(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const updateStatus = (id, action) => {
    fetch(`http://localhost:8000/api/shipments/${id}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la mise à jour du statut');
      return res.json();
    })
    .then(() => {
      setShipments(prev =>
        prev.map(s => s.id === id ? {...s, status: action === 'accept' ? 'accepted' : 'rejected'} : s)
      );
    })
    .catch(err => console.error(err));
  };

  if (loading) return <p>Chargement des expéditions...</p>;

  if (shipments.length === 0) return <p>Aucune expédition pour le moment.</p>;

  return (
    <div>
      <h3>Résumé des marchandises</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Contact</th>
            <th>Téléphone</th>
            <th>Pays départ</th>
            <th>Pays arrivée</th>
            <th>Ville départ</th>
            <th>Ville arrivée</th>
            <th>Poids</th>
            <th>Service</th>
            <th>Type de fret</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map(shipment => (
            <tr key={shipment.id}>
              <td>{shipment.contact}</td>
              <td>{shipment.phone}</td>
              <td>{shipment.country_from}</td>
              <td>{shipment.country_to}</td>
              <td>{shipment.city_from}</td>
              <td>{shipment.city_to}</td>
              <td>{shipment.weight}</td>
              <td>{shipment.service}</td>
              <td>{shipment.freight_type}</td>
              <td>{shipment.status}</td>
              <td>
                {shipment.status === 'pending' ? (
                  <>
                    <button onClick={() => updateStatus(shipment.id, 'accept')}>Accepter</button>
                    <button onClick={() => updateStatus(shipment.id, 'reject')}>Refuser</button>
                  </>
                ) : (
                  <em>{shipment.status === 'accepted' ? 'Acceptée' : 'Refusée'}</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentsSummary;
