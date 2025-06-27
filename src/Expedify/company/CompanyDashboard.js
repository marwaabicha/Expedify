import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShipmentsSummary from '../ShipmentSummary';
import CompanyApplicationForm from '../CompanyApplicationForm';
function DashboardCompany() {
  const [company, setCompany] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Fonction pour fetch avec gestion commune des erreurs
    async function fetchWithAuth(url) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate('/login');
          throw new Error('Non autorisé, redirection vers login');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la requête');
      }
      return response.json();
    }

    // Chargement des données de la compagnie puis des commandes
    async function loadData() {
      try {
        const companyData = await fetchWithAuth('http://localhost:8000/api/company-profile');
        setCompany(companyData);

        const packagesData = await fetchWithAuth('http://localhost:8000/api/company-submissions');
        setPackages(packagesData);

        setLoading(false);
      } catch (error) {
        console.error(error);
        // La redirection vers login est déjà faite dans fetchWithAuth si besoin
      }
    }

    loadData();
  }, [navigate]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Bonjour, {company.company_name} 👋</h2>
      <CompanyApplicationForm/>

      <h3>Résumé des commandes passées :</h3>
      {packages.length === 0 ? (
        <p>Aucune commande enregistrée.</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Nom expéditeur</th>
              <th>Nom destinataire</th>
              <th>Pays origine</th>
              <th>Pays destination</th>
              <th>Poids (kg)</th>
              <th>Méthode transport</th>
              <th>Méthode paiement</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id}>
                <td>{pkg.sender_name}</td>
                <td>{pkg.receiver_name}</td>
                <td>{pkg.origin_country}</td>
                <td>{pkg.destination_country}</td>
                <td>{pkg.weight}</td>
                <td>{pkg.transport_method}</td>
                <td>{pkg.payment_method}</td>
                <td>{new Date(pkg.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ShipmentsSummary/>
    </div>
  );
}

export default DashboardCompany;
