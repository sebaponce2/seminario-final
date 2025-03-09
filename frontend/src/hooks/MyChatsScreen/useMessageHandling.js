"use client";

import { useState } from "react";
import { createNewMessageClient } from "../../services/chats";

export const useMessageHandling = (
  selectedChat,
  setSelectedChat,
  user,
  updateChatOrder,
  sendSocketMessage
) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const body = {
      chat_id: selectedChat.chat_id,
      user_id: user.user_id,
      content: newMessage,
    };

    try {
      await createNewMessageClient(user.token, body);

      // Emite el mensaje a través del socket
      if (newMessage.length > 0) {
        sendSocketMessage({
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

      updateChatOrder(selectedChat.chat_id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.log("Error al enviar mensaje:", error);
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage,
  };
};