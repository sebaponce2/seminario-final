import { useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { loadFromLocalStorage } from "../useLocaleStorage";

export const useSocketConnection = (
  selectedChat,
  setSelectedChat,
  setConversationsList
) => {
  const socketRef = useRef(null);

  const initializeSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8080");

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server with id", socketRef.current.id);

        if (selectedChat?.chat_id) {
          socketRef.current.emit("join", selectedChat.chat_id);
        }
      });

      socketRef.current.on("message", handleIncomingMessage);
    }
  };

  const handleIncomingMessage = async (received) => {
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

      // Encuentra el chat actualizado y lo mueve al inicio
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
  };

  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit("message", messageData);
    }
  };

  useEffect(() => {
    initializeSocket();

    return () => {
      if (!socketRef.current?.connected) {
        socketRef.current.connect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
  };
};