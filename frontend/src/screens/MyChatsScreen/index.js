import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

// Datos de ejemplo
const conversations = [
  {
    id: 1,
    name: "Ana López",
    lastMessage: "Claro, es una tostadora marca Hamilton Beach..",
    unread: false,
    avatar:
      "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
    messages: [
      {
        id: 1,
        text: "Hola, ¿tienes una licuadora disponible?",
        time: "10:30 AM",
        sent: false,
      },
      {
        id: 2,
        text: "¡Hola Ana! Sí, tengo una licuadora en buen estado. ¿Qué te interesaría ofrecer a cambio?",
        time: "10:35 AM",
        sent: true,
      },
      {
        id: 3,
        text: "Genial. Tengo una tostadora casi nueva que podría intercambiar. ¿Te interesa?",
        time: "10:40 AM",
        sent: false,
      },
      {
        id: 4,
        text: "Suena interesante. ¿Podrías darme más detalles sobre la tostadora? ¿Marca, tiempo de uso?",
        time: "10:45 AM",
        sent: true,
      },
      {
        id: 5,
        text: "Claro, es una tostadora marca Hamilton Beach, la he usado solo un par de veces. Está prácticamente nueva.",
        time: "10:50 AM",
        sent: false,
      },
      {
        id: 6,
        text: "Perfecto, me interesa. ¿Podrías enviarme una foto?",
        time: "10:55 AM",
        sent: true,
      },
      {
        id: 7,
        text: "Claro, dame un momento y te la envío.",
        time: "10:57 AM",
        sent: false,
      },
      {
        id: 8,
        text: "Aquí tienes la foto. ¿Qué opinas?",
        time: "11:00 AM",
        sent: false,
      },
      {
        id: 9,
        text: "Se ve en excelente estado. Creo que podemos hacer el intercambio.",
        time: "11:05 AM",
        sent: true,
      },
      {
        id: 10,
        text: "¡Genial! ¿Cuándo podríamos reunirnos?",
        time: "11:10 AM",
        sent: false,
      },
      {
        id: 11,
        text: "¿Te parece bien mañana a las 3 PM en el centro comercial?",
        time: "11:15 AM",
        sent: true,
      },
      {
        id: 12,
        text: "Perfecto, allí estaré. Gracias.",
        time: "11:20 AM",
        sent: false,
      },
      {
        id: 13,
        text: "De nada, ¡nos vemos mañana!",
        time: "11:25 A. M.",
        sent: true,
      },
    ],
  },
  {
    id: 2,
    name: "María García",
    lastMessage: "Gracias por tu ayuda",
    unread: false,
    avatar:
      "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
    messages: [],
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    lastMessage: "Nos vemos mañana",
    unread: true,
    avatar:
      "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
    messages: [],
  },
];

export const MyChatsScreen = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); // Referencia al textarea

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSelectedChat((prevChat) => ({
      ...prevChat,
      messages: [
        ...prevChat.messages,
        {
          id: prevChat.messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          }),
          sent: true,
        },
      ],
    }));
    setNewMessage("");
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatOnMobile(true);
    textareaRef.current?.focus(); // Enfoca el textarea cuando se selecciona un chat
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
      textareaRef.current?.focus(); // Enfoca el textarea cuando se selecciona un chat
    }
  }, [selectedChat, selectedChat?.messages]);

  return (
    <div style={{ height: "calc(100vh - 72px)" }} className="flex bg-white">
      {/* Lista de conversaciones */}
      <div
        className={`w-full md:w-1/4 border-r ${
          showChatOnMobile ? "hidden md:block" : "block"
        }`}
      >
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
                className={`flex items-center p-4 border-b cursor-pointer overflow-y-hidden ${
                  selectedChat?.id === chat.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-50"
                }`}
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
                  <p className={`${chat.unread && "font-semibold"} text-gray-600 text-sm truncate w-full overflow-hidden whitespace-nowrap`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vista del chat */}
      <div
        style={{ maxWidth: "100vw" }}
        className={`flex-1 flex flex-col w-screen ${
          !showChatOnMobile ? "hidden md:flex" : "flex"
        }`}
      >
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
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full"
              />
              <h2 className="ml-3 font-semibold text-black">
                {selectedChat.name}
              </h2>
            </div>

            <div
              style={{ maxWidth: "75vw" }}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] w-auto inline-block rounded-lg px-4 py-2 ${
                      message.sent
                        ? "bg-black text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sent ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t flex gap-2"
            >
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Escribe un mensaje..."
                rows={1}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-black resize-none overflow-y-auto"
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
