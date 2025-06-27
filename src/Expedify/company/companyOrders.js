import React, { useEffect, useState } from 'react';

const CompanyOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/company/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const data = await response.json();
    setOrders(data);
  };

  const markAsDelivered = async (orderId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/api/orders/${orderId}/mark-delivered`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    fetchOrders(); // Refresh list
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Commandes reçues</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Pays</th>
            <th>Transport</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.name}</td>
              <td>{order.from_country} → {order.to_country}</td>
              <td>{order.transport_type}</td>
              <td>{order.status}</td>
              <td>
                {order.status !== 'delivered' && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => markAsDelivered(order.id)}
                  >
                    Marquer comme livré
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyOrders;
