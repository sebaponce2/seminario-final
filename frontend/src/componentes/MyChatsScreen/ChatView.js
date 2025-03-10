import { useEffect, useState } from "react";
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
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(() => {
    if (selectedChat) {
      setFocusTrigger((prev) => prev + 1);
    }
  }, [selectedChat]);

  const handleSubmit = (e) => {
    handleSendMessage(e);
    setTimeout(() => {
      setFocusTrigger((prev) => prev + 1);
    }, 0);
  };

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
            onSubmit={handleSubmit}
            shouldFocus={focusTrigger}
          />
        </>
      )}
    </div>
  );
};
export default ChatView;