import "./chat.css";
import { useConversations } from "../../hooks/MyChatsScreen/useConversations";
import { useSocketConnection } from "../../hooks/MyChatsScreen/useSocketConnection";
import { useMessageHandling } from "../../hooks/MyChatsScreen/useMessageHandling";
import ChatView from "../../componentes/MyChatsScreen/ChatView";
import ConversationList from "../../componentes/MyChatsScreen/ConversationList";
import Loader from "react-js-loader";

export const MyChatsScreen = () => {
  // Custom hook para manejar las conversaciones
  const {
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
  } = useConversations();

  // Custom hook para manejar la conexión con el socket
  const { sendMessage } = useSocketConnection(
    selectedChat,
    setSelectedChat,
    setConversationsList
  );

  // Custom hook para manejar los mensajes
  const { newMessage, setNewMessage, handleSendMessage } = useMessageHandling(
    selectedChat,
    setSelectedChat,
    user,
    updateChatOrder,
    sendMessage
  );

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
        <div style={{ height: "calc(100vh - 72px)" }} className="flex bg-white">
          <ConversationList
            conversations={conversationsList}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            showOnMobile={showChatOnMobile}
          />
          <ChatView
            selectedChat={selectedChat}
            user={user}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            setShowChatOnMobile={setShowChatOnMobile}
            showChatOnMobile={showChatOnMobile}
          />
        </div>
      )}
    </>
  );
};