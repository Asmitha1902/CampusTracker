import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(stored);
    setUser(userObj);
    
    fetchRequests(userObj.id);
    const reqInterval = setInterval(() => {
      fetchRequests(userObj.id);
    }, 5000);

    return () => clearInterval(reqInterval);
  }, [navigate]);

  const fetchRequests = async (userId) => {
    try {
      const res = await fetch(`http://localhost:9090/api/chat/requests`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        
        // Update activeRequest if its status changed
        setActiveRequest(prev => {
          if (!prev) return prev;
          const updatedReq = data.find(r => r.id == prev.id);
          return updatedReq ? updatedReq : prev;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (reqId) => {
    try {
      const res = await fetch(`http://localhost:9090/api/chat/messages/${reqId}`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let interval;
    if (activeRequest && activeRequest.status === "ACCEPTED") {
      fetchMessages(activeRequest.id);
      interval = setInterval(() => {
        fetchMessages(activeRequest.id);
      }, 3000);
    } else {
      setMessages([]);
    }
    return () => clearInterval(interval);
  }, [activeRequest]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStatusChange = async (reqId, status) => {
    try {
      const res = await fetch(`http://localhost:9090/api/chat/request/${reqId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include"
      });
      if (res.ok) {
        fetchRequests(user.id);
        if (activeRequest && activeRequest.id === reqId) {
          setActiveRequest(prev => ({...prev, status}));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeRequest || activeRequest.status !== "ACCEPTED") return;

    try {
      const res = await fetch("http://localhost:9090/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: activeRequest.id,
          content: msgInput
        }),
        credentials: "include"
      });

      if (res.ok) {
        setMsgInput("");
        fetchMessages(activeRequest.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>Chats & Requests</h3>
        </div>
        <div className="chat-list">
          {requests.map(req => {
            const isMeSender = req.senderId == user?.id;
            const otherName = isMeSender ? req.receiverName : req.senderName;
            
            return (
              <div 
                key={req.id} 
                className={`chat-item ${activeRequest?.id == req.id ? 'active' : ''}`}
                onClick={() => setActiveRequest(req)}
              >
                <div className="chat-item-name">{otherName}</div>
                <div className="chat-item-meta">
                  <span>Item: {req.itemName}</span>
                  <span className={`chat-status ${req.status.toLowerCase()}`}>{req.status}</span>
                </div>
              </div>
            );
          })}
          {requests.length === 0 && (
            <div style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>No requests found.</div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeRequest ? (
          <>
            <div className="chat-header">
              <h3>
                {activeRequest.senderId == user?.id 
                  ? activeRequest.receiverName 
                  : activeRequest.senderName} 
                <span style={{fontSize:'12px', color:'#64748b', marginLeft:'10px'}}>Item: {activeRequest.itemName}</span>
              </h3>
              
              {activeRequest.receiverId == user?.id && activeRequest.status === "PENDING" && (
                <div className="chat-actions">
                  <button className="btn-accept" onClick={() => handleStatusChange(activeRequest.id, "ACCEPTED")}>Accept</button>
                  <button className="btn-reject" onClick={() => handleStatusChange(activeRequest.id, "REJECTED")}>Reject</button>
                </div>
              )}
            </div>

            <div className="chat-messages">
              {activeRequest.status === "ACCEPTED" ? (
                <>
                  {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.senderId == user?.id ? 'sent' : 'received'}`}>
                      {msg.content}
                      <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  {messages.length === 0 && <div className="empty-chat">No messages yet. Say hi!</div>}
                </>
              ) : (
                <div className="empty-chat">
                   {activeRequest.status === "PENDING" 
                    ? (activeRequest.senderId == user?.id ? "Waiting for the other user to accept..." : "You need to accept the request to start chatting.") 
                    : "This request was rejected."}
                </div>
              )}
            </div>

            {activeRequest.status === "ACCEPTED" && (
              <form className="chat-input" onSubmit={sendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            )}
          </>
        ) : (
          <div className="empty-chat">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
