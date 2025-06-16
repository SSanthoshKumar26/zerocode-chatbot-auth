import React from 'react';

interface Props {
  sender: 'user' | 'bot';
  text: string;
}

export const ChatMessage: React.FC<Props> = ({ sender, text }) => {
  const isUser = sender === 'user';
  return (
    <div className={`p-2 my-1 max-w-xs ${isUser ? 'ml-auto text-right bg-blue-500 text-white' : 'bg-gray-200'}`}>
      {text}
    </div>
  );
};
