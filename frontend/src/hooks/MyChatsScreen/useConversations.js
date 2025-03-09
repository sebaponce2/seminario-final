"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getChatsListClient,
  getChatMessagesClient,
} from "../../services/chats";
import { loadFromLocalStorage } from "../useLocaleStorage";

export const useConversations = () => {
  const [conversationsList, setConversationsList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { state: chat_id } = location || {};

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
  };

  const updateChatOrder = (chatId, lastMessage) => {
    setConversationsList((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.chat_id === chatId) {
          return {
            ...chat,
            lastMessage,
          };
        }
        return chat;
      });

      // Encuentra el chat actualizado y muévelo al inicio
      const chatToMove = updatedChats.find((chat) => chat.chat_id === chatId);
      const filteredChats = updatedChats.filter(
        (chat) => chat.chat_id !== chatId
      );

      return [chatToMove, ...filteredChats];
    });
  };

  useEffect(() => {
    getConversations();
  }, []);

  return {
    conversationsList,
    setConversationsList,
    selectedChat,
    setSelectedChat,
    user,
    isLoading,
    showChatOnMobile,
    setShowChatOnMobile,
    handleChatSelect,
    updateChatOrder,
  };
};