import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
  // Supprimer les données de l'utilisateur à chaque rechargement
  localStorage.removeItem('user');     
  sessionStorage.removeItem('user');   
  // navigate('/login');
}, []);
const handleLogout = () => {
  // Supprimer les données utilisateur stockées
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  
  // Optionnel : tu peux aussi supprimer un token si stocké
  localStorage.removeItem('token');

  // Rediriger vers la page de connexion
  navigate('/login');
};

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-200 shadow-md py-5 px-8 z-50">
      <nav className="flex justify-end items-center space-x-6">
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-blue-600 transition">Accueil</Link></li>
          <li><Link to="/" className="hover:text-blue-600 transition">Services</Link></li>
          <li><Link to="/" className="hover:text-blue-600 transition">Qui Sommes-nous</Link></li>
          {!user && (
            <li><Link to="/login" className="hover:text-blue-600 transition">Connexion</Link></li>
          )}
        </ul>

        
          {user && (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="p-2 bg-gray-100 rounded-full hover:bg-gray-300 transition"
    >
      <UserIcon size={24} className="text-gray-700" aria-label="Profil utilisateur" />
    </button>

            {isOpen && (
              <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/company-list">Liste Compagnies</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/orders">Mes Demandes</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/shippingPage">Envoyer des Marchandises</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/problem">Signaler Un Problème</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <button onClick={handleLogout} className="w-full text-left">Déconnexion</button>

                </li>
              </ul>
            )}
          </div>
        )} 
      </nav>
    </header>
  );
};

export default Header;
