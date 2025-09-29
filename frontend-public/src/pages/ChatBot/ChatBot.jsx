import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: "Hola, ¿en qué puedo ayudarte?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();
  const chatBoxRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("https://bluefruitnutrition-production.up.railway.app/api/chat/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.answer, sender: "bot" }]);
    } catch {
      setMessages(prev => [...prev, { text: "Error de conexión", sender: "bot" }]);
    }

    setInput("");
  };

  const clearChat = () => {
    setMessages([{ text: "Hola, ¿en qué puedo ayudarte?", sender: "bot" }]);
    chatBoxRef.current.scrollTop = 0;
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
        <button onClick={clearChat} className="clear-btn" title="Limpiar conversación">
          🗑️
        </button>
      </div>
    </div>
  );
}
