import React, { useState } from 'react';
import { Send } from 'lucide-react';

// Datos de ejemplo
const conversations = [
  {
    id: 1,
    name: "Ana López",
    lastMessage: "Claro, es una tostadora marca Hamilton Beach..",
    unread: false,
    avatar: "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
    messages: [
      {
        id: 1,
        text: "Hola, ¿tienes una licuadora disponible?",
        time: "10:30 AM",
        sent: false
      },
      {
        id: 2,
        text: "¡Hola Ana! Sí, tengo una licuadora en buen estado. ¿Qué te interesaría ofrecer a cambio?",
        time: "10:35 AM",
        sent: true
      },
      {
        id: 3,
        text: "Genial. Tengo una tostadora casi nueva que podría intercambiar. ¿Te interesa?",
        time: "10:40 AM",
        sent: false
      },
      {
        id: 4,
        text: "Suena interesante. ¿Podrías darme más detalles sobre la tostadora? ¿Marca, tiempo de uso?",
        time: "10:45 AM",
        sent: true
      },
      {
        id: 5,
        text: "Claro, es una tostadora marca Hamilton Beach, la he usado solo un par de veces. Está prácticamente nueva.",
        time: "10:50 AM",
        sent: false
      }
    ]
  },
  {
    id: 2,
    name: "María García",
    lastMessage: "Gracias por tu ayuda",
    unread: false,
    avatar: "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
    messages: []
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    lastMessage: "Nos vemos mañana",
    unread: true,
    avatar: "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
    messages: []
  }
];

export const MyChatsScreen = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatOnMobile(true);
  };

  return (
    <div style={{ height: 'calc(100vh - 72px)' }} className="flex bg-white">
      {/* Lista de conversaciones */}
      <div className={`w-full md:w-1/4 border-r ${showChatOnMobile ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-black">Chats</h1>
        </div>
        <div className="overflow-y-hidden">
          {conversations.length === 0 ? ( 
            <div className="h-full flex items-center justify-center text-gray-500">
              No tienes conversaciones
            </div>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 overflow-y-hidden ${selectedChat?.id === chat.id ? 'bg-gray-200' : ''}`}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3 flex-1 overflow-x-hidden">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-black">{chat.name}</h2>
                    {chat.unread && (
                      <span className="bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        1
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm truncate w-full overflow-hidden whitespace-nowrap">{chat.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vista del chat */}
      <div className={`flex-1 flex flex-col ${!showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona una conversación
          </div>
        ) : (
          <>
            <div className="flex items-center p-4 border-b">
              <button
                onClick={() => setShowChatOnMobile(false)}
                className="md:hidden mr-2 text-black"
              >
                ←
              </button>
              <img
                src='https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg'
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full"
              />
              <h2 className="ml-3 font-semibold text-black">{selectedChat.name}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${message.sent ? 'bg-black text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sent ? 'text-gray-300' : 'text-gray-500'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="bg-black text-white rounded-lg p-2 hover:bg-gray-800"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
