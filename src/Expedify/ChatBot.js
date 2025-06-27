import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "react-feather";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour ! Je suis ExpedifyBot, comment puis-je vous aider ?" }
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simuler une réponse du chatbot
    const botResponse = await generateBotResponse(input.toLowerCase());
    setMessages(prev => [...prev, { role: "assistant", content: botResponse }]);
  };

  const generateBotResponse = async (userInput) => {
    // Logique de réponse simple basée sur des mots-clés
    if (userInput.includes("suivi") || userInput.includes("commande")) {
      return "Pour suivre votre commande, veuillez vous rendre dans la section 'Mes Commandes' et cliquer sur le bouton 'Suivre'. Vous pouvez également entrer votre numéro de commande ici.";
    }
    if (userInput.includes("prix") || userInput.includes("tarif")) {
      return "Nos tarifs varient en fonction de la distance, du poids et des dimensions de votre colis. Vous pouvez obtenir un devis instantané en utilisant notre calculateur de prix.";
    }
    if (userInput.includes("délai") || userInput.includes("durée")) {
      return "Les délais de livraison dépendent de la destination. En général, nous livrons en 24-48h en ville et 2-5 jours pour les zones rurales.";
    }
    if (userInput.includes("contact") || userInput.includes("service client")) {
      return "Vous pouvez contacter notre service client au 0800-123-456 ou par email à support@expedify.com";
    }
    if (userInput.includes("merci")) {
      return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
    }
    if (userInput.includes("bonjour") || userInput.includes("salut")) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    }

    return "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous la reformuler ou choisir parmi ces sujets : suivi de commande, tarifs, délais de livraison, contact service client.";
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">ExpedifyBot</span>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={20} />
            </button>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-green-200 self-end ml-auto text-right"
                    : "bg-gray-200 self-start mr-auto text-left"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 p-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Écrivez un message..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
