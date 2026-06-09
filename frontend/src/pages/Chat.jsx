import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Search, Phone, Video, MoreVertical } from 'lucide-react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL || `http://${import.meta.env.VITE_API_URL}`);

const Chat = () => {
  const user = JSON.parse(localStorage.getItem('usis_user') || '{}');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeContact, setActiveContact] = useState(1);
  const messagesEndRef = useRef(null);

  const contacts = [
    { id: 1, name: 'Dr. Sarah Jenkins', role: 'Mentor', status: 'online', avatar: 'SJ' },
    { id: 2, name: 'Prof. Alan Smith', role: 'Database Systems', status: 'offline', avatar: 'AS' },
    { id: 3, name: 'Alex Johnson', role: 'Student Project Partner', status: 'online', avatar: 'AJ' },
  ];

  useEffect(() => {
    // Join a room based on active contact. In a real app, this would be a unique chat ID.
    const room = `chat_${Math.min(user.id || 0, activeContact)}_${Math.max(user.id || 0, activeContact)}`;
    socket.emit('join_room', room);

    const receiveMessageHandler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('receive_message', receiveMessageHandler);

    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [activeContact, user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const room = `chat_${Math.min(user.id || 0, activeContact)}_${Math.max(user.id || 0, activeContact)}`;
      const messageData = {
        room: room,
        senderId: user.id || 0,
        senderName: user.name || 'You',
        text: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      socket.emit('send_message', messageData);
      setInputMessage('');
    }
  };

  const activeContactInfo = contacts.find(c => c.id === activeContact);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden backdrop-blur-md">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-slate-700 flex flex-col bg-slate-800/80">
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                setActiveContact(contact.id);
                setMessages([]);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeContact === contact.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-slate-300">
                  {contact.avatar}
                </div>
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <h4 className="font-semibold text-slate-200 truncate">{contact.name}</h4>
                <p className="text-xs text-slate-400 truncate">{contact.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900/50">
        {/* Chat Header */}
        <div className="h-20 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              {activeContactInfo?.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{activeContactInfo?.name}</h3>
              <p className="text-xs text-emerald-400">{activeContactInfo?.status === 'online' ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
              <div className="p-4 bg-slate-800 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <p>Start a conversation with {activeContactInfo?.name}</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === (user.id || 0);
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-lg ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
            <button 
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
