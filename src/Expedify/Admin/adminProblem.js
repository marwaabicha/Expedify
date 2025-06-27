import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProblem = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/problems');
      setProblems(response.data);
    } catch (err) {
      setError('Une erreur est survenue lors de la récupération des problèmes.');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Fonction pour marquer un problème comme résolu
  const handleMarkAsResolved = async (problemId) => {
    try {
      // Appel API pour mettre à jour le statut en "close"
      await axios.put(`http://localhost:8000/api/admin/problems/${problemId}/resolve`);
      
      // Mise à jour locale du state
      setProblems((prevProblems) =>
        prevProblems.map((problem) =>
          problem.id === problemId ? { ...problem, status: 'close' } : problem
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut du problème.');
    }
  };

  const renderProblemCard = (problem) => (
    <div key={problem.id} className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{problem.title}</h3>
      <p className="text-gray-600 mb-3">{problem.description}</p>
      
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Catégorie: {problem.category}
        </span>
        <span className={`px-3 py-1 rounded-full ${
          problem.urgency === 'high' ? 'bg-red-100 text-red-800' : 
          problem.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          Urgence: {problem.urgency}
        </span>
        <span className={`px-3 py-1 rounded-full ${
          problem.status === 'open' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'
        }`}>
          Statut: {problem.status}
        </span>
        {problem.attachments && (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
            Pièces jointes: {problem.attachments}
          </span>
        )}
      </div>

      {/* Bouton "Résolu" seulement si le statut est "open" */}
      {problem.status === 'open' && (
        <button
          onClick={() => handleMarkAsResolved(problem.id)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Marquer comme résolu
        </button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Gestion des Problèmes</h1>
      
      {problems.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">Aucun problème signalé pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map(renderProblemCard)}
        </div>
      )}
    </div>
  );
};

export default AdminProblem;
