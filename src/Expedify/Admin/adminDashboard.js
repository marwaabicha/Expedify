import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BriefcaseIcon, CheckCircleIcon, XCircleIcon, BellIcon, 
  ArrowPathIcon, EyeIcon, ChevronDownIcon 
} from '@heroicons/react/24/outline';
import AdminStatsChart from './adminStateChart';
import AdminProblemDashboard from './adminProblem';

const AdminDashboard = () => {
  const [allRequests, setAllRequests] = useState([]); // Toutes les demandes
  const [displayedRequests, setDisplayedRequests] = useState([]); // Demandes affichées (filtrées)
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [activeTab, setActiveTab] = useState('requests');
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestFilter, setRequestFilter] = useState('pending'); // 'all', 'pending', 'accepted', 'rejected'
  const navigate = useNavigate();

  // Récupère toutes les demandes
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/company-requests');
      setAllRequests(response.data);
      filterRequests(response.data, requestFilter);
      
      // Calcul des compteurs
      const pending = response.data.filter(req => req.status === 'pending').length;
      const accepted = response.data.filter(req => req.status === 'accepted').length;
      const rejected = response.data.filter(req => req.status === 'rejected').length;
      
      setPendingCount(pending);
      setAcceptedCount(accepted);
      setRejectedCount(rejected);
    } catch (error) {
      console.error('Erreur de chargement des demandes :', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtre les demandes selon le filtre sélectionné
  const filterRequests = (requests, filter) => {
    let filtered = requests;
    if (filter !== 'all') {
      filtered = requests.filter(req => req.status === filter);
    }
    setDisplayedRequests(filtered);
  };

  // Récupère les notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/notifications/count');
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error("Erreur notifications :", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRequests(allRequests, requestFilter);
  }, [requestFilter, allRequests]);

  const goToDetails = (id) => {
    navigate(`/admin/company/${id}`);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/company-requests/${id}`, { status });
      await fetchRequests(); // Recharge toutes les données
      await fetchNotifications();
    } catch (err) {
      console.error('Erreur de mise à jour :', err);
    }
  };

  const refreshData = () => {
    fetchRequests();
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={refreshData}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Actualiser"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <BellIcon className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`${activeTab === 'requests' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Demandes
            </button>
            <button
              onClick={() => setActiveTab('problem')}
              className={`${activeTab === 'problem' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Problèmes
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`${activeTab === 'stats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Statistiques
            </button>
          </nav>
        </div>

        {activeTab === 'requests' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div 
                className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer ${requestFilter === 'pending' ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setRequestFilter('pending')}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">En attente</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{pendingCount}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer ${requestFilter === 'accepted' ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setRequestFilter('accepted')}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Acceptées</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{acceptedCount}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer ${requestFilter === 'rejected' ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setRequestFilter('rejected')}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                      <XCircleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Rejetées</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{rejectedCount}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Demandes des sociétés</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {requestFilter === 'all' ? 'Toutes les demandes' : 
                     requestFilter === 'pending' ? 'Demandes en attente' :
                     requestFilter === 'accepted' ? 'Demandes acceptées' : 'Demandes rejetées'}
                  </p>
                </div>
                <div className="relative">
                  <select
                    value={requestFilter}
                    onChange={(e) => setRequestFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">Toutes</option>
                    <option value="pending">En attente</option>
                    <option value="accepted">Acceptées</option>
                    <option value="rejected">Rejetées</option>
                  </select>
                  <ChevronDownIcon className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Chargement des demandes...</p>
                </div>
              ) : displayedRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {requestFilter === 'pending' ? (
                    '🎉 Aucune demande en attente'
                  ) : (
                    `Aucune demande ${requestFilter === 'accepted' ? 'acceptée' : 'rejetée'}`
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {displayedRequests.map((req) => (
                    <li key={req.id} className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 flex-1">
                          <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
                          <div className="min-w-0 flex flex-col">
                            <p className="text-sm font-medium text-gray-900 truncate">{req.companyName}</p>
                            <p className="text-sm text-gray-500 truncate">{req.email}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              req.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {req.status === 'pending' ? 'En attente' : req.status === 'accepted' ? 'Acceptée' : 'Rejetée'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => goToDetails(req.id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            title="Détails"
                          >
                            <EyeIcon className="h-5 w-5 mr-1" /> Détails
                          </button>
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(req.id, 'accepted')}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                title="Approuver"
                              >
                                <CheckCircleIcon className="h-5 w-5 mr-1" /> Approuver
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req.id, 'rejected')}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                title="Rejeter"
                              >
                                <XCircleIcon className="h-5 w-5 mr-1" /> Rejeter
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        )}
          {activeTab === 'problem' && (
          <div>
            <AdminProblemDashboard/>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <AdminStatsChart accepted={acceptedCount} rejected={rejectedCount} pending={pendingCount} />
          </div>
        )}
      </main>
     
     
    </div>
  );
};

export default AdminDashboard;