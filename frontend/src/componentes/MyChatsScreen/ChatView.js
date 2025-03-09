"use client";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const ChatView = ({
  selectedChat,
  user,
  newMessage,
  setNewMessage,
  handleSendMessage,
  setShowChatOnMobile,
  showChatOnMobile,
}) => {
  return (
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
          <ChatHeader
            chat={selectedChat}
            onBackClick={() => setShowChatOnMobile(false)}
          />
          <ChatMessages
            messages={selectedChat.messages}
            currentUserId={user?.user_id}
          />
          <ChatInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onSubmit={handleSendMessage}
          />
        </>
      )}
    </div>
  );
};

export default ChatView;