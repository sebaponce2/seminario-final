import React from "react";

const ChatHeader = ({ chat, onBackClick }) => {
  return (
    <div className="flex items-center p-4 border-b">
      <button onClick={onBackClick} className="md:hidden mr-2 text-black">
        ←
      </button>
      <img
        src={chat?.profile_picture || "/placeholder.svg"}
        alt={chat?.name}
        className="w-10 h-10 rounded-full"
      />
      <h2 className="ml-3 font-semibold text-black">
        {`${chat?.name} ${chat?.last_name}`}
      </h2>
    </div>
  );
};

export default ChatHeader;