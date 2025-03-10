"use client";

import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ value, onChange, onSubmit, shouldFocus }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [shouldFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4 border-t flex gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje..."
        rows={1}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-black resize-none overflow-y-auto"
      />

      <button
        type="submit"
        className="bg-black text-white rounded-lg p-2 hover:bg-gray-800"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;