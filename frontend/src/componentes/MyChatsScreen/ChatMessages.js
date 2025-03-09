"use client";

import { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";

const ChatMessages = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-size flex-1 overflow-y-auto p-4 space-y-4">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            isCurrentUser={message?.user_id === currentUserId}
          />
        ))
      ) : (
        <div className="text-center text-gray-500"> </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;