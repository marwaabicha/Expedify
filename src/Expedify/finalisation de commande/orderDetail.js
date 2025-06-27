import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Rating, TextField, Button } from "@mui/material";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const positions = {
  Morocco: [31.7917, -7.0926],
  France: [46.6034, 1.8883],
  Spain: [40.4637, -3.7492],
  Germany: [51.1657, 10.4515],
  Italy: [41.8719, 12.5674],
  Portugal: [39.3999, -8.2245],
  Belgium: [50.5039, 4.4699],
  Netherlands: [52.1326, 5.2913],
  UK: [55.3781, -3.4360],
};

const redIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [animatedRoute, setAnimatedRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [optimalRoute, setOptimalRoute] = useState([]);
  const [intermediateStops, setIntermediateStops] = useState([]);
  const [mapCenter, setMapCenter] = useState([0, 0]);

  // Note: In production, store API keys securely (e.g., environment variables)
  const apiKey = '5b3ce3597851110001cf6248164e8149556a4b548381542131bc1efc';

  const fetchCountryCoordinates = async (countryName) => {
    try {
      // First check our predefined positions
      if (positions[countryName]) {
        return positions[countryName];
      }
      
      // Fallback to geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(countryName)}&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) throw new Error("Error fetching order");
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    const fetchOptimalRoute = async () => {
      if (!order) return;

      try {
        const fromCoords = await fetchCountryCoordinates(order.from_country);
        const toCoords = await fetchCountryCoordinates(order.to_country);

        if (!fromCoords || !toCoords) {
          console.error("Missing coordinates for specified countries");
          return;
        }

        // Calculate map center
        setMapCenter([
          (fromCoords[0] + toCoords[0]) / 2,
          (fromCoords[1] + toCoords[1]) / 2
        ]);

        // Simulation of intermediate stops
        const countries = Object.keys(positions);
        const fromIndex = countries.indexOf(order.from_country);
        const toIndex = countries.indexOf(order.to_country);

        let stops = [];
        if (fromIndex !== -1 && toIndex !== -1) {
          if (fromIndex < toIndex) {
            for (let i = fromIndex + 1; i < toIndex; i++) {
              stops.push(positions[countries[i]]);
            }
          } else {
            for (let i = fromIndex - 1; i > toIndex; i--) {
              stops.push(positions[countries[i]]);
            }
          }
        }
        setIntermediateStops(stops);

        const allPoints = [fromCoords, ...stops, toCoords];
        const optimizedCoords = [];
        let totalDistance = 0;
        let totalDuration = 0;

        for (let i = 0; i < allPoints.length - 1; i++) {
          const start = allPoints[i];
          const end = allPoints[i + 1];
          try {
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
              const segmentCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
              optimizedCoords.push(...segmentCoords);
              totalDistance += data.features[0].properties.summary.distance;
              totalDuration += data.features[0].properties.summary.duration;
            }
          } catch (error) {
            console.error("Error fetching route segment:", error);
            // Fallback to straight line between points if API fails
            optimizedCoords.push(start, end);
          }
        }

        setDistance((totalDistance / 1000).toFixed(2));
        setDuration((totalDuration / 3600).toFixed(2));
        setOptimalRoute(optimizedCoords);
        setRouteCoords(optimizedCoords);
      } catch (error) {
        console.error("Error in fetchOptimalRoute:", error);
      }
    };

    fetchOptimalRoute();
  }, [order]);

  useEffect(() => {
    if (routeCoords.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        setAnimatedRoute(routeCoords.slice(0, index + 1));
        index++;
        if (index >= routeCoords.length) clearInterval(interval);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [routeCoords]);

  const handleSubmitRating = () => {
    alert(`Thank you for rating ${order?.carrier || 'our service'}! Rating: ${rating}, Comment: ${comment}`);
    setRating(0);
    setComment("");
  };

  if (!order) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    </div>
  );

  const fromPos = positions[order.from_country] || [0, 0];
  const toPos = positions[order.to_country] || [0, 0];
  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne principale - Informations du colis */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Commande #{order.order_code}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'livré' 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'En transit' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
            <span className="text-gray-600">
              <span className="font-medium">Créée le:</span> {new Date(order.created_at).toLocaleDateString('fr-FR')}
            </span>
            {order.date_livraison_estimee && (
              <span className="text-gray-600">
                <span className="font-medium">Livraison estimée:</span> {new Date(order.date_livraison_estimee).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Origine</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.from_country}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Destination</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.to_country}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-2 text-gray-700">Détails du transport</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Poids</p>
              <p className="font-medium">{order.weight} kg</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Prix estimé</p>
              <p className="font-medium">{order.estimated_price} €</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Type de transport</p>
              <p className="font-medium">{order.transport_type}</p>
            </div>
          </div>

          {distance && duration && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{distance} km</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Durée estimée</p>
                <p className="font-medium">{duration} heures</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Trajet optimal</p>
                <p className="font-medium">{intermediateStops.length + 1} étapes</p>
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-2 text-gray-700">Historique du trajet</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-green-500"></div>
              <div className="ml-4 pb-4 border-b border-gray-200 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Commande créée</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p className="text-sm text-gray-600">Préparation en cours</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-blue-500"></div>
              <div className="ml-4 pb-4 border-b border-gray-200 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">En transit</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p className="text-sm text-gray-600">Colis en cours de transport</p>
              </div>
            </div>
            {order.status === 'livré' && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-red-500"></div>
                <div className="ml-4 pb-4 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Livré</p>
                    <p className="text-sm text-gray-500">
                      {order.date_livraison_estimee ? new Date(order.date_livraison_estimee).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">Colis livré avec succès</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Colonne latérale - Carte et évaluation */}
      <div className="space-y-6">
        {/* Improved interactive map */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Package optimal route</h2>
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer 
              center={mapCenter} 
              zoom={5} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={fromPos} icon={greenIcon}>
                <Popup>Origin: {order.from_country}</Popup>
              </Marker>
              <Marker position={toPos} icon={redIcon}>
                <Popup>Destination: {order.to_country}</Popup>
              </Marker>
              {intermediateStops.map((stop, index) => (
                <Marker key={index} position={stop}>
                  <Popup>Stop {index + 1}</Popup>
                </Marker>
              ))}
              {animatedRoute.length > 0 && (
                <Polyline 
                  positions={animatedRoute} 
                  color="blue"
                  weight={4}
                />
              )}
            </MapContainer>
          </div>
          <div className="mt-3 flex justify-between text-sm text-gray-600">
            <span>From: {order.from_country}</span>
            <span>To: {order.to_country}</span>
          </div>
          {intermediateStops.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">Waypoints:</p>
              <ul className="list-disc pl-5">
                {intermediateStops.map((_, index) => (
                  <li key={index}>Stop {index + 1}</li>
                ))}
              </ul>
            </div>
          )}
        </div>


        {/* Section Évaluation - Seulement si la commande est livrée */}
        {order.status === 'delivred' && (
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Évaluer le service</h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Notez notre service</p>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Votre commentaire (facultatif)"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRating}
              size="large"
              fullWidth
              disabled={rating === 0}
              sx={{ 
                backgroundColor: '#1E40AF', 
                '&:hover': { backgroundColor: '#1E3A8A' },
                '&.Mui-disabled': { backgroundColor: '#E5E7EB' }
              }}
            >
              Soumettre l'évaluation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;