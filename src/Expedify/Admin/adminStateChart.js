import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Enregistrer tous les éléments nécessaires
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

const AdminStatsChart = ({ accepted, rejected, pending }) => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // '7days', '30days', '90days'
  const [activeChart, setActiveChart] = useState('line'); // 'line', 'bar', 'pie'
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/admin/stats?range=${timeRange}`);
      const { problems, requests, companies } = response.data;

      // Préparation des données pour les différents graphiques
      const labels = [...new Set([...problems, ...requests].map(item => item.date))].sort();

      const lineChartData = {
        labels,
        datasets: [
          {
            label: 'Problèmes signalés',
            data: labels.map(date => {
              const item = problems.find(p => p.date === date);
              return item ? item.count : 0;
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Demandes de société',
            data: labels.map(date => {
              const item = requests.find(r => r.date === date);
              return item ? item.count : 0;
            }),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.3
          }
        ]
      };

      const barChartData = {
        labels: ['Demandes'],
        datasets: [
          {
            label: 'En attente',
            data: [pending],
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
          },
          {
            label: 'Acceptées',
            data: [accepted],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
          },
          {
            label: 'Rejetées',
            data: [rejected],
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
          }
        ]
      };

      const pieChartData = {
        labels: ['Entreprises actives', 'Entreprises inactives'],
        datasets: [{
          data: [companies.active, companies.inactive],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderWidth: 1
        }]
      };

      setChartData({
        line: lineChartData,
        bar: barChartData,
        pie: pieChartData,
        rawData: response.data
      });
    } catch (err) {
      console.error("Erreur chargement stats :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="my-6 p-4 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Statistiques</h2>
        
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
          </select>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveChart('line')} 
              className={`px-3 py-1 rounded-md text-sm ${activeChart === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
            >
              Ligne
            </button>
            <button 
              onClick={() => setActiveChart('bar')} 
              className={`px-3 py-1 rounded-md text-sm ${activeChart === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
            >
              Barres
            </button>
            <button 
              onClick={() => setActiveChart('pie')} 
              className={`px-3 py-1 rounded-md text-sm ${activeChart === 'pie' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
            >
              Secteurs
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : chartData ? (
        <div className="h-96">
          {activeChart === 'line' && (
            <Line 
              data={chartData.line} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: `Activité sur ${timeRange === '7days' ? '7' : timeRange === '30days' ? '30' : '90'} jours`
                  }
                }
              }} 
            />
          )}
          {activeChart === 'bar' && (
            <Bar 
              data={chartData.bar} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Statut des demandes'
                  }
                }
              }} 
            />
          )}
          {activeChart === 'pie' && (
            <Pie 
              data={chartData.pie} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Statut des entreprises'
                  }
                }
              }} 
            />
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
      )}

      {/* Résumé statistique */}
      {chartData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Problèmes signalés</h3>
            <p className="text-2xl font-bold">
              {chartData.rawData.problems.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Demandes totales</h3>
            <p className="text-2xl font-bold">
              {chartData.rawData.requests.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Entreprises actives</h3>
            <p className="text-2xl font-bold">
              {chartData.rawData.companies.active} / {chartData.rawData.companies.active + chartData.rawData.companies.inactive}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatsChart;