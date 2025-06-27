import React, { useState } from 'react';

function SearchForm() {
  const [formData, setFormData] = useState({
    transport_methods: '',
    from_country: '',
    to_country: '',
    weight: '',
    max_price: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gérer la saisie dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Préparer les données à envoyer, forcer max_price à 0 si vide
    const payload = {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      max_price: formData.max_price ? parseFloat(formData.max_price) : 0,
    };

    try {
      const response = await fetch('http://localhost:8000/api/search', { // adapte cette URL à ton backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Type de transport :
          <select
            name="transport_methods"
            value={formData.transport_methods}
            onChange={handleChange}
            required
          >
            <option value="">--Choisir--</option>
            <option value="routier">Routier</option>
            <option value="maritime">Maritime</option>
            <option value="aerien">Aérien</option>
          </select>
        </label>

        <label>
          Pays de départ :
          <input
            type="text"
            name="from_country"
            value={formData.from_country}
            onChange={handleChange}
            placeholder="Ex: France"
            required
          />
        </label>

        <label>
          Pays de destination :
          <input
            type="text"
            name="to_country"
            value={formData.to_country}
            onChange={handleChange}
            placeholder="Ex: Maroc"
            required
          />
        </label>

        <label>
          Poids (kg) :
          <input
            type="number"
            name="weight"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Ex: 12.5"
            required
          />
        </label>

        <label>
          Prix max (€) (optionnel) :
          <input
            type="number"
            name="max_price"
            min="0"
            step="0.01"
            value={formData.max_price}
            onChange={handleChange}
            placeholder="Ex: 1000"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

      <div>
        <h2>Résultats :</h2>
        {results.length === 0 && !loading && <p>Aucun résultat</p>}

        {results.map((company) => (
  <li key={company.id}>
    <strong>{company.company_name}</strong> - Pays: {company.delivery_country} - Statut: {company.status}
  </li>
))}

      </div>
    </div>
  );
}

export default SearchForm;
