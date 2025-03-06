import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import {
  createNewMessageClient,
  getChatMessagesClient,
  getChatsListClient,
} from "../../services/chats";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Loader from "react-js-loader";

export const MyChatsScreen = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [conversationsList, setConversationsList] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); // Referencia al textarea
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const socketRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { state: chat_id } = location || {};

  useEffect(() => {
    handleSocket();

    return () => {
      if (!socketRef.current?.connected) {
        socketRef.current.connect();
      }
    };
  }, []);

  const handleSocket = async () => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8080");

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server with id", socketRef.current.id);

        if (selectedChat?.chat_id) {
          socketRef.current.emit("join", selectedChat.chat_id);
        }
      });

      socketRef.current.on("message", async (received) => {
        const auth = await loadFromLocalStorage("auth");
        
        setConversationsList((prevChats) => {
          if (received.to !== auth?.user_id) {
            return prevChats;
          }
          // Mapea y actualiza la lista
          const updatedChats = prevChats.map((chat) => {
            if (chat.chat_id === received.chatId) {
              return {
                ...chat,
                lastMessage: received.message,
              };
            }
            return chat;
          });

          // Encuentra el chat actualizado y muévelo al inicio
          const chatToMove = updatedChats.find(
            (chat) => chat.chat_id === received.chatId
          );
          const filteredChats = updatedChats.filter(
            (chat) => chat.chat_id !== received.chatId
          );

          return [chatToMove, ...filteredChats];
        });

          setSelectedChat((prevChat) => {
            if (prevChat && prevChat.chat_id === received.chatId) {
              return {
                ...prevChat,
                messages: [
                  ...prevChat.messages,
                  {
                    user_id: received.from,
                    content: received.message,
                    send_date: new Date(),
                  },
                ],
              };
            }
            return prevChat;
          });
      });
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    const auth = await loadFromLocalStorage("auth");
    setUser(auth);
    setLoading(true);
    try {
      const data = await getChatsListClient(auth?.token, chat_id);
      validateSelectChat(data);

      if (data) {
        setConversationsList(data);
      }
    } catch (error) {
      console.log("Error al obtener conversaciones:", error);
    } finally {
      if (chat_id) {
        navigate(location.pathname, { replace: true }); // Reemplaza la URL eliminando el estado
      }
      setLoading(false);
    }
  };

  const validateSelectChat = (chats) => {
    if (chat_id) {
      const chat = chats.find((chat) => chat.chat_id === chat_id);
      if (chat) {
        handleChatSelect(chat);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const body = {
      chat_id: selectedChat.chat_id,
      user_id: user.user_id,
      content: newMessage,
    };

    try {
      await createNewMessageClient(user.token, body);

      // Emite el mensaje a través del socket
      if (newMessage.length > 0) {
        socketRef.current.emit("message", {
          message: newMessage,
          chatId: selectedChat.chat_id,
          from: user.user_id,
          name: user.name,
          last_name: user.last_name,
          profile_picture: user.profile_picture,
          to: selectedChat.user_id,
        });
      }

      setSelectedChat((prevChat) => ({
        ...prevChat,
        lastMessage: newMessage,
        messages: [
          ...prevChat.messages,
          {
            user_id: user.user_id,
            content: newMessage,
            send_date: new Date(),
          },
        ],
      }));

      updateLastMessage();
      setNewMessage("");
    } catch (error) {
      console.log("Error al enviar mensaje:", error);
    }
  };

  const updateLastMessage = () => {
    setConversationsList((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.chat_id === selectedChat.chat_id) {
          return {
            ...chat,
            lastMessage: newMessage,
          };
        }
        return chat;
      });

      // Encuentra el chat actualizado y muévelo al inicio
      const chatToMove = updatedChats.find(
        (chat) => chat.chat_id === selectedChat.chat_id
      );
      const filteredChats = updatedChats.filter(
        (chat) => chat.chat_id !== selectedChat.chat_id
      );

      return [chatToMove, ...filteredChats];
    });
  };

  const handleChatSelect = async (chat) => {
    const { token } = await loadFromLocalStorage("auth");
    const data = await getChatMessagesClient(token, chat?.chat_id);

    if (data) {
      setSelectedChat({
        ...chat,
        messages: data,
      });
    }
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

  const formatMessageHour = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });
  };
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
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
              {conversationsList.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 mt-2">
                  No tienes conversaciones
                </div>
              ) : (
                conversationsList.map((chat, index) => (
                  <div
                    key={index}
                    onClick={() => handleChatSelect(chat)}
                    className={`flex items-center p-4 border-b cursor-pointer overflow-y-hidden ${
                      selectedChat?.chat_id === chat?.chat_id
                        ? "bg-gray-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={chat?.profile_picture}
                      alt={chat?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3 flex-1 overflow-x-hidden ">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-black">{`${chat?.name} ${chat?.last_name}`}</h2>
                      </div>
                      {chat?.lastMessage ? (
                        <p
                          className={
                            "text-gray-600 text-sm truncate w-full overflow-hidden whitespace-nowrap"
                          }
                        >
                          {chat?.lastMessage}
                        </p>
                      ) : (
                        <div className="text-gray-200 text-sm">-</div>
                      )}
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
                    src={selectedChat?.profile_picture}
                    alt={selectedChat?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <h2 className="ml-3 font-semibold text-black">
                    {`${selectedChat?.name} ${selectedChat?.last_name}`}
                  </h2>
                </div>

                <div
                  style={{ maxWidth: "75vw" }}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {selectedChat && selectedChat?.messages?.length > 0 ? (
                    selectedChat?.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message?.user_id === user?.user_id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] w-auto inline-block rounded-lg px-4 py-2 ${
                            message?.user_id === user?.user_id
                              ? "bg-black text-white rounded-br-none"
                              : "bg-gray-200 text-black rounded-bl-none"
                          }`}
                        >
                          <p className="break-words">{message?.content}</p>
                          <div className="flex justify-end">
                            <p
                              className={`text-xs mt-1 ${
                                message?.user_id === user?.user_id
                                  ? "text-gray-300"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatMessageHour(message?.send_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500"> </div>
                  )}
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
      )}
    </>
  );
};
