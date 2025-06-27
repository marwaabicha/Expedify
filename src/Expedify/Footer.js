import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Liens d'accès rapides */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b-2 border-yellow-500 pb-2">
            Liens d'accès rapides
          </h3>
          <ul className="space-y-2">
            <li>Service Client</li>
            <li>Connexion au portail client</li>
            <li>Partenaires numériques</li>
            <li>Portail développeur</li>
            <li>Obtenir un devis</li>
            <li>Expedify pour le Business</li>
          </ul>
        </div>

        {/* Nos divisions */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b-2 border-yellow-500 pb-2">
            Nos divisions
          </h3>
          <ul className="space-y-2">
            <li>Expedify Express</li>
            <li>Expedify Global Forwarding</li>
            <li>Expedify Freight</li>
          </ul>
        </div>

        {/* Secteurs d'industries */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b-2 border-yellow-500 pb-2">
            Secteurs d'industries
          </h3>
          <ul className="space-y-2">
            <li>Auto-Mobilité</li>
            <li>Ingénierie et fabrication</li>
            <li>Autres divisions internationales</li>
            <li>Vente au détail et mode</li>
            <li>Technologie</li>
          </ul>
        </div>

        {/* Informations sur la société */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b-2 border-yellow-500 pb-2">
            Informations sur la société
          </h3>
          <ul className="space-y-2">
            <li>À propos de Expedify</li>
            <li>Deliverd</li>
            <li>Carrières</li>
            <li>Centre de presse</li>
            <li>Investisseurs</li>
            <li>Durabilité</li>
            <li>Innovation</li>
            <li>Événements</li>
            <li>Partenariats avec des marques</li>
          </ul>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Expedify Group</h3>
        <p className="text-sm mt-2">
          Sensibilisation à la fraude | Mention légale | Conditions d'utilisation | Avis de confidentialité | Résolution des litiges
        </p>
        <p className="text-sm">Informations complémentaires | Paramètres des cookies</p>
        <p className="text-sm mt-4">© 2025 - Tous droits réservés</p>

      </div>
    </footer>
  );
};

export default Footer;
