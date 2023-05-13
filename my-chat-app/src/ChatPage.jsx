import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChatPage() {
  const { username } = useParams();
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);

  const fetchChat = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          prompt: `${username}: ${text}`,
          max_tokens: 60,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      setChat((oldChat) => [
        ...oldChat,
        { role: "user", content: text },
        { role: "assistant", content: response.data.choices[0].text.trim() },
      ]);
      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchChat();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-6 bg-white rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chat with GPT-3</h2>
        <div className="chat-box border p-4 mb-4 h-64 overflow-auto">
          {chat.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="w-full mt-2 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
