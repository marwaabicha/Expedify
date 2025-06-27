import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const statusColors = {
  'livré': { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
  'En cours': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🔄' },
  'annulé': { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
  'en préparation': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📦' }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8000/api/my-orders", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Stats calculation
  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'livré').length,
    pending: orders.filter(o => o.status === 'En cours').length,
    cancelled: orders.filter(o => o.status === 'annulé').length,
    preparing: orders.filter(o => o.status === 'en préparation').length,
    totalAmount: orders.reduce((sum, order) => sum + (order.estimated_price || 0), 0)
  };

  // Sorting function
  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtered orders
  const filteredOrders = sortedOrders
    .filter(order => 
      order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.from_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.to_country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(order => statusFilter === "all" || order.status === statusFilter);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-fuchsia-500 border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Réessayer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg p-8"
        >
          <div className="mx-auto h-24 w-24 bg-fuchsia-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande trouvée</h3>
          <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande.</p>
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-200"
          >
            Passer votre première commande
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600">
          Mes Commandes
        </h1>
        <p className="mt-3 text-xl text-gray-600">
          Retrouvez l'historique complet de vos achats
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-10"
      >
        {/* Total Orders */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-fuchsia-500"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-fuchsia-100 rounded-lg p-3">
                <span className="text-fuchsia-600 text-xl">📋</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivered */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-green-500"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <span className="text-green-600 text-xl">🚚</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Livrées</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.delivered}</div>
                    <div className="ml-2 text-sm font-medium text-green-600">
                      {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-yellow-500"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En cours</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.pending}</div>
                    <div className="ml-2 text-sm font-medium text-yellow-600">
                      {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preparing */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-blue-500"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En préparation</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.preparing}</div>
                    <div className="ml-2 text-sm font-medium text-blue-600">
                      {stats.total > 0 ? Math.round((stats.preparing / stats.total) * 100) : 0}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Amount */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-purple-500"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Montant total</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalAmount.toFixed(2)} €</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-white p-5 rounded-xl shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                placeholder="Rechercher commandes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full sm:w-48">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                {Object.keys(statusColors).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white shadow overflow-hidden sm:rounded-xl mb-10"
      >
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
          <div 
            className="col-span-3 flex items-center cursor-pointer hover:text-gray-700"
            onClick={() => requestSort('order_code')}
          >
            N° Commande
            {sortConfig.key === 'order_code' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div 
            className="col-span-2 flex items-center cursor-pointer hover:text-gray-700"
            onClick={() => requestSort('created_at')}
          >
            Date
            {sortConfig.key === 'created_at' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div 
            className="col-span-2 flex items-center cursor-pointer hover:text-gray-700"
            onClick={() => requestSort('status')}
          >
            Statut
            {sortConfig.key === 'status' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div className="col-span-3">Trajet</div>
          <div 
            className="col-span-1 flex items-center cursor-pointer hover:text-gray-700"
            onClick={() => requestSort('estimated_price')}
          >
            Montant
            {sortConfig.key === 'estimated_price' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Orders */}
        {filteredOrders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <motion.li 
                key={order.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Order Number */}
                    <div className="col-span-3">
                      <p className="text-sm font-bold text-fuchsia-600">#{order.order_code}</p>
                    </div>
                    
                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[order.status]?.bg || 'bg-gray-100'
                      } ${statusColors[order.status]?.text || 'text-gray-800'}`}>
                        {statusColors[order.status]?.icon || ''} {order.status}
                      </span>
                    </div>
                    
                    {/* Route */}
                    <div className="col-span-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{order.from_country}</span> → <span className="font-medium">{order.to_country}</span>
                      </p>
                    </div>
                    
                    {/* Amount */}
                    <div className="col-span-1">
                      <p className="text-sm font-medium text-gray-900">{order.estimated_price} €</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="col-span-1 flex justify-end">
                      <Link
                        to={`/order-details/${order.id}`}
                        className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-900"
                      >
                        Détails →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune commande trouvée</h3>
            <p className="mt-1 text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Exporter mes commandes
        </button>
      </motion.div>
    </div>
  );
};

export default MyOrders;