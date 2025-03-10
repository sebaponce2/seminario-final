import ConversationListRow from "./ConversationListRow";

const ConversationList = ({
  conversations,
  selectedChat,
  onChatSelect,
  showOnMobile,
}) => {
  return (
    <div
      className={`w-full md:w-1/4 border-r ${
        showOnMobile ? "hidden md:block" : "block"
      }`}
    >
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-black">Chats</h1>
      </div>
      <div className="overflow-y-hidden">
        {conversations.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 mt-2">
            No tienes conversaciones
          </div>
        ) : (
          conversations.map((chat, index) => (
            <ConversationListRow
              key={index}
              chat={chat}
              isSelected={selectedChat?.chat_id === chat?.chat_id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;