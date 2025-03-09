const MessageItem = ({ message, isCurrentUser }) => {
  const formatMessageHour = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] w-auto inline-block rounded-lg px-4 py-2 ${
          isCurrentUser
            ? "bg-black text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        <p className="break-words">{message?.content}</p>
        <div className="flex justify-end">
          <p
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {formatMessageHour(message?.send_date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;