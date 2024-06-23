/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";

function Chat() {
  const { auth, logout } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoadding, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const hasCreatedChatSession = useRef(false);

  useEffect(() => {
    // Check if the chat session has already been created and auth token is available
    if (!hasCreatedChatSession.current && auth.token) {
      // Set the flag to true to indicate that the chat session has been created
      hasCreatedChatSession.current = true;

      // Create the chat session and set the chat ID
      const createChatSession = async () => {
        console.log("Creating chat session");
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/chat/",
            {},
            {
              headers: {
                Authorization: `Token ${auth.token}`,
              },
            }
          );
          setChatId(response.data.chat_id);
          console.log("Chat Session ID:", response.data.chat_id);
        } catch (error) {
          // if unauthorized error, call logout function
          if (error.response.status === 401) {
            console.log("Unauthorized error, logging out");
            logout();
          }
          console.error("Error creating chat session:", error);
        }
      };

      // Call the function to create the chat session
      createChatSession();
    }
  }, [auth.token]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (isLoadding) return;
    setIsLoading(true);
    console.log(inputValue);
    const tempMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(tempMessages);
    // Call the api and add the response to the messages array.
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat-message/",
        {
          chat_id: chatId,
          message: inputValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${auth.token}`,
          },
        }
      );

      const newMessages = [
        ...tempMessages,
        { role: "model", content: response.data.response },
      ];
      setMessages(newMessages);
      setInputValue("");
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response.status === 401) {
        console.log("Unauthorized error, logging out");
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container mb-4">
      <div className="messages-list">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={
              message.role === "model"
                ? "message-gemini mt-3"
                : "message-user mt-3"
            }
          >
            <div style={{ whiteSpace: "pre-line" }}>{message.content}</div>
          </div>
        ))}
        {isLoadding && (
          <div className="chat-bubble">
            <div className="typing">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Reference for scrolling */}
      </div>
      <form className="message-form" onSubmit={handleSubmit}>
        <div className="mt-1">
          <input
            type="text"
            className="form-control message-input"
            value={inputValue}
            onChange={handleChange}
            placeholder="Type your message"
          />
        </div>
        <button style={{ display: "none" }} type="submit" />
      </form>
    </div>
  );
}

export default Chat;
