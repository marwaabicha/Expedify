import React from 'react';
import Slider from "react-slick";
import { Container, Typography, Box } from "@mui/material";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
const partners = [
  { name: "Partner 1", logo: "royal maroc.png" },
  { name: "Partner 2", logo: "tnt.png" },
  { name: "Partner 3", logo: "ups.png" },
  { name: "Partner 4", logo: "cargolux.png" },
  { name: "Partner 5", logo: "dhl2.jpg" },
  { name: "Partner 6", logo: "chronopost.jpeg" },
];
const Service = () => {
  const services = [
    'Solutions professionnelles personnalisées',
    'Prochain jour ouvrable',
    "Options d'importation/exportation flexibles",
    'Large éventail de services en option'
  ];
  const settings = {
    dots: false, 
    infinite: true, 
    speed: 1000, 
    slidesToShow: 4, 
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2000, 
    pauseOnHover: false, 
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  const cards = [
    {
      title: 'Durabilité',
      description: "L'entreprise durable commence par des chaînes d'approvisionnement durables. Découvrez ce que nous proposons, pourquoi nous sommes engagés dans le développement durable et comment notre industrie contribue à un avenir meilleur.",
      image: 'OIP.jpeg',
    },
    {
      title: 'Innovation',
      description: "Découvrez l'avenir de la logistique grâce à une innovation centrée sur le client, une recherche de tendances de pointe et des solutions novatrices.",
      image: 'welcome-to-the-future.jpeg',
    },
    {
      title: 'Expedify Trade Atlas 2025',
      description: "Les échanges mondiaux ont repris en 2022 et devraient croître dans les prochaines années grâce à la décisive précipitation.",
      image: 'trade-atlas-teaser-image.jpeg',
    },
  ];

  const logistics = [
    '🚚 Fret aérien',
    '🚢 Fret maritime',
    '🚛 Fret routier',
    '🚆 Fret ferroviaire'
  ];

  return (
    <div className="w-full px-6 py-12 bg-gray-100">
      {/* Section Expédition des Colis */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Expédition des Colis</h1>
        <h2 className="text-xl text-gray-600 mt-2">Pour tous les expéditeurs</h2>
        <hr className="w-24 border-t-2 border-blue-500 mx-auto my-4" />
        <p className="text-gray-700 max-w-xl mx-auto">
          Découvrez Expedify, le leader incontesté de l'expédition express à l'international.
        </p>
      </div>

      {/* Expédition de Marchandises */}
      <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
        <img src="marchandise2.jpeg" alt="Containers" className="w-full md:w-1/2 rounded-lg shadow-lg" />
        <div className="md:ml-10 mt-6 md:mt-0 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">Expédition de Marchandises</h1><br/>
          <hr class="cmp-separator__horizontal-rule"></hr>
          <h2 className="text-xl text-gray-600 mt-2">Professionnels uniquement</h2>
          <ul className="mt-4 grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <li key={index} className="text-gray-700">{service}</li>
            ))}
          </ul>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Découvrez Expedify Global Forwarding
          </button>
        </div>
      </div>

      {/* Section Logistique inversée */}
      <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col md:flex-row items-center mt-10">
  <div className="md:w-1/2 md:pr-10 text-left">
    <h1 className="text-3xl font-bold text-gray-800">Expédition de Colis</h1><br/>
    <hr class="cmp-separator__horizontal-rule"></hr>
    <h2 className="text-xl text-gray-600 mt-2">Services de logistique</h2><br/>
    <ul className="mt-4 grid grid-cols-2 gap-4">
      {logistics.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ul>
    <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
      Découvrez Expedify Global Forwarding
    </button>
  </div>
  <img src="colis2.jpeg" alt="Containers" className="w-full md:w-1/2 rounded-lg shadow-lg" />
</div>
  {/* Section Nos Initiatives */}
  <div className="mt-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Nos Initiatives</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <img className="w-full rounded-lg" src={card.image} alt={card.title} />
              <div className="mt-4">
                <h2 className="text-2xl font-semibold text-gray-800">{card.title}</h2>
                <p className="text-gray-600 mt-2">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Box sx={{ py: 6, backgroundColor: "#f9f9f9" }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Nos partenaires
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" mb={4}>
          Ils nous font confiance
        </Typography>
        
        <Slider {...settings}>
          {partners.map((partner, index) => (
            <Box key={index} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={partner.logo} alt={partner.name} style={{ maxWidth: "150px", maxHeight: "80px", objectFit: "contain" }} />
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
    </div>
  );
};

export default Service;
