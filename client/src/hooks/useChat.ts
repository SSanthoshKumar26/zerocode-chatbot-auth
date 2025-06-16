import { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [lastSent, setLastSent] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const now = Date.now();
    if (now - lastSent < 1500) {
      setError('⏳ Please wait before sending another message.');
      return;
    }

    setLastSent(now);
    setError('');
    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: userMessage.text,
        }),
      });

      const data = await response.json();

      const reply = data?.text?.trim() || '⚠️ No response from Cohere.';
      const botMessage: Message = { sender: 'bot', text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Error talking to Cohere API.' },
      ]);
      setError('Failed to fetch response from Cohere.');
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, sendMessage, loading, bottomRef, error };
};

export default useChat;
