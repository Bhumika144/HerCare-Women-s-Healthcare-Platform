import { useState } from "react";
import "../styles/SupportBot.css";

export default function SupportBot() {
  const [messages, setMessages] = useState([
    { text: "Hi 👋 I'm your health support assistant. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { text: data.reply, sender: "bot" }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { text: "⚠️ Server error. Try again.", sender: "bot" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">

      <div className="chat-header">Support Bot 🤖</div>
      <div className="chat-sub">Talk freely. I'm here to support you 💛</div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="message bot typing">
            Bot is typing...
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}