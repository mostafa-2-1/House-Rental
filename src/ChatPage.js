import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import { NavigationBar } from "./Components/NavigationBar.js";
import { useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBE9yal7KzrezuvF5-qAQeGXA4F61mTwCQ",
  authDomain: "house-184b9.firebaseapp.com",
  projectId: "house-184b9",
  storageBucket: "house-184b9.firebasestorage.app",
  messagingSenderId: "641558261694",
  appId: "1:641558261694:web:d0f2293e8d2c9a1b9353ef",
  measurementId: "G-X1TEV5F5TK"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

const ChatApp = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState("Select a User");
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchUsers = async () => {
          const messagesRef = collection(db, "messages");
          const q = query(messagesRef, orderBy("timestamp"));
          onSnapshot(q, (querySnapshot) => {
            const usersSet = new Set();
            querySnapshot.forEach((doc) => {
              const message = doc.data();
              if (message.sender !== currentUser.uid) {
                usersSet.add(message.sender);
              }
            });
            setUsers([...usersSet]);
          });
        };
        fetchUsers();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [db, auth]);

  const selectUser = (username) => {
    setCurrentChatUser(username);
    setMessages(users[username] || []);
  };

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;
    try {
      const messagesRef = collection(db, "messages");

      await addDoc(messagesRef, {
        sender: user?.uid || "User1",
        receiver: currentChatUser,
        message: messageInput.trim(),
        timestamp: new Date(),
      });

      setMessageInput("");
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  const makeCall = () => {
    if (currentChatUser === "Select a User") {
      alert("Please select a user to call.");
    } else {
      alert(`Calling ${currentChatUser}...`);
    }
  };

  const attachFile = () => {
    alert("File attachment functionality coming soon!");
  };

  const navigateToPayment = () => {
    setPaymentModalVisible(true);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const confirmPayment = () => {
    if (selectedPaymentMethod) {
      alert(`Payment Method: ${selectedPaymentMethod}`);
      setPaymentModalVisible(false);
    } else {
      alert("Please select a payment method.");
    }
  };

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bodyy">
      <div className="containerr">
        <div className="sidebar">
          <div className="menu-icon">☰</div>
          <h3>Today</h3>
          <input
            type="text"
            id="search-bar"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
          <ul className="user-list">
            {users
              .filter((username) => username.toLowerCase().includes(searchTerm))
              .map((username) => (
                <li key={username} onClick={() => selectUser(username)}>
                  <span className="user-icon">👤</span>
                  <span className="user-name">{username}</span>
                  <span className="user-time">8:00pm</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="chat-section">
          <div className="chat-header">
            <span className="profile-icon">👤</span>
            <span className="chat-user">{currentChatUser}</span>
            <div className="chat-actions">
              <button id="call-btn" onClick={makeCall}>
                📞 Call
              </button>
            </div>
          </div>
          <div className="chat-body">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="chat-message sent">
                  <p>{message.message}</p>
                  <small>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p className="placeholder-text">
                Start a conversation by selecting a user.
              </p>
            )}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              id="message-input"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button id="attachment-btn" onClick={attachFile}>
              📎
            </button>
            <button id="send-btn" onClick={sendMessage}>
              Send
            </button>
            <button id="payment-btn" onClick={navigateToPayment}>
              Choose Payment Method
            </button>
          </div>

          {paymentModalVisible && (
            <div id="payment-modal" className="payment-modal">
              <div className="modal-content">
                <h2>Choose Payment Method</h2>
                <label>
                  Pay by Online
                  <input
                    checked={selectedPaymentMethod === "Pay Online"}
                    type="radio"
                    name="payment-method"
                    value="Pay Online"
                    onChange={handlePaymentMethodChange}
                  />
                </label>
                <label>
                  Pay by Hand
                  <input
                    checked={selectedPaymentMethod === "Pay by Hand"}
                    type="radio"
                    name="payment-method"
                    value="Pay by Hand"
                    onChange={handlePaymentMethodChange}
                  />
                </label>
                <div className="modal-actions">
                  <button onClick={() => setPaymentModalVisible(false)}>Cancel</button>
                  <button onClick={confirmPayment}>Confirm</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <NavigationBar />
      </div>
    </div>
  );
};

export default ChatApp;
