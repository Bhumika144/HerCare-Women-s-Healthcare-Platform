// src/pages/SupportBot.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaSmile, FaHeart, FaSpinner } from 'react-icons/fa';
import { GiFlowerStar } from 'react-icons/gi';
import "../styles/SupportBot.css";

export default function SupportBot() {
  const [messages, setMessages] = useState([
    { 
      text: "Hi 👋 I'm your health support assistant. How can I help you today?", 
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      text: input, 
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setIsTyping(false);
      setMessages([
        ...newMessages,
        { 
          text: data.reply, 
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        { 
          text: "⚠️ Server error. Please try again.", 
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    "How to track my period?",
    "Health tips for women",
    "Mindfulness exercises",
    "Cycle phase explanation"
  ];

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }
  };

  const typingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="supportbot-page">
      {/* Background decoration */}
      <div className="supportbot-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <motion.div 
        className="supportbot-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="supportbot-header">
          <div className="header-left">
            <motion.div 
              className="bot-avatar"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaRobot />
            </motion.div>
            <div className="header-info">
              <h2>Support Bot</h2>
              <p className="bot-status">
                <span className="status-dot"></span>
                Online • Here to help
              </p>
            </div>
          </div>
          <div className="header-right">
            <motion.div 
              className="heart-icon"
              whileHover={{ scale: 1.2 }}
            >
              <FaHeart />
            </motion.div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="supportbot-sub">
          <GiFlowerStar className="sub-icon" />
          <span>Talk freely. I'm here to support you 💛</span>
        </div>

        {/* Chat Box */}
        <div className="supportbot-chat-box">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                className={`message-wrapper ${msg.sender}`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className={`message-bubble ${msg.sender}`}>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div 
                className="message-wrapper bot"
                variants={typingVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="message-bubble bot typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="quick-replies">
          {quickReplies.map((reply, index) => (
            <motion.button
              key={index}
              className="quick-reply-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInput(reply);
                setTimeout(() => sendMessage(), 100);
              }}
              disabled={loading}
            >
              {reply}
            </motion.button>
          ))}
        </div>

        {/* Input Area */}
        <div className="supportbot-input-area">
          <motion.button 
            className="emoji-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSmile />
          </motion.button>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          
          <motion.button 
            className="send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <FaSpinner className="spinning" />
            ) : (
              <FaPaperPlane />
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}