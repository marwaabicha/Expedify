import React from 'react';
import SearchFrom from './RechercheCompagnie/SearchForm';
import Service from './Service';
import Footer from './Footer';
import Header from './Header';


import ChatBot from './ChatBot';


const Acceuil = () => {
   const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="w-full mx-auto">
     <Header user={user}/>
      
      <div className="relative">
      {/* Hero Section with background image */}
      <div className="relative h-[90vh] w-full mt-16">
        <img 
          src="R.jpeg" 
          className="w-full h-full object-cover" 
          alt="Transport et logistique" 
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-50 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Découvrez Expedify</h1>
          <p className="text-lg md:text-xl font-semibold">L'expédition rapide, fiable et sans limites !</p>
        </div>
        </div>
     

      {/* Expedify component superposed */}
     
      {/* Contenu principal */}
      <main className="py-8">

             <SearchFrom />

        <Service />
      </main>
<ChatBot/>
      <Footer />

    </div>
    </div>
  );
};

export default Acceuil;
