"use client";

const ConversationListRow = ({ chat, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 border-b cursor-pointer overflow-y-hidden ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-50"
      }`}
    >
      <img
        src={chat?.profile_picture || "/placeholder.svg"}
        alt={chat?.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="ml-3 flex-1 overflow-x-hidden ">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-black">{`${chat?.name} ${chat?.last_name}`}</h2>
        </div>
        {chat?.lastMessage ? (
          <p className="text-gray-600 text-sm truncate w-full overflow-hidden whitespace-nowrap">
            {chat?.lastMessage}
          </p>
        ) : (
          <div className="text-gray-200 text-sm">-</div>
        )}
      </div>
    </div>
  );
};

export default ConversationListRow;