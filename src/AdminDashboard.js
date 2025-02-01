import React, { useState } from "react";
import "./AdminDashboard.css";
import { NavigationBar } from "./Components/NavigationBar";
import { useNavigate } from "react-router-dom";
const MonitorTransactions = () => {
  return (
    <div className="transactions-page">
      <h2>Monitor Financial Transactions</h2>
      <p>Here you can monitor financial transactions.</p>
      
    </div>
    
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { name: "User1", id: 1 },
    { name: "User2", id: 2 },
    { name: "User3", id: 3 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempBanModal, setTempBanModal] = useState(false);
  const [permanentBanModal, setPermanentBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("monitor");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const openTempBanModal = (userId) => {
    console.log('Rest');
    setSelectedUser(userId);
    setTempBanModal(true);
  };

  const handleLogout = () =>{
    localStorage.removeItem('memberId');
    localStorage.removeItem('authToken');

    navigate('/login');
    console.log("Logout functionality to be implemented");
  }
  const openPermanentBanModal = (userId) => {
    setSelectedUser(userId);
    setPermanentBanModal(true);
  };

  const closeTempBanModal = () => {
    setTempBanModal(false);
    setSelectedUser(null);
  };

  const closePermanentBanModal = () => {
    setPermanentBanModal(false);
    setSelectedUser(null);
  };

  const submitBan = () => {
    const selectedDuration = document.querySelector(
      'input[name="ban-duration"]:checked'
    );
    if (selectedDuration) {
      const banDuration = selectedDuration.value;
      alert(
        `User with ID: ${selectedUser} is temporarily banned for ${banDuration}`
      );
      closeTempBanModal();
    } else {
      alert("Please select a ban duration.");
    }
  };

  const submitPermanentBan = () => {
    alert(`User with ID: ${selectedUser} has been permanently banned.`);
    closePermanentBanModal();
  };

  return (
    <div>
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === "monitor" ? "active" : ""}
          onClick={() => setActiveTab("monitor")}
        >
          Monitor Financial Transactions
        </button>
        <button
          className={activeTab === "search" ? "active" : ""}
          onClick={() => setActiveTab("search")}
        >
          Search for Users
        </button>
      </div>

      {activeTab === "monitor" && <MonitorTransactions />}
      {activeTab === "search" && (
        <div>
          <input
            type="text"
            placeholder="Search Users..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />

          <div className="user-list">
            {users
              .filter((user) => user.name.toLowerCase().includes(searchTerm))
              .map((user) => (
                <div key={user.id} className="user-item">
                  <span className="user-name">{user.name}</span>
                  <select
                    className="ban-dropdown"
                    onChange={(e) => {
                      if (e.target.value === "temporary") {
                        console.log('TEST');
                        openTempBanModal(user.id);
                      }
                      if (e.target.value === "permanent") {
                        openPermanentBanModal(user.id);
                      }
                    }}
                  >
                    <option>Select</option>
                    <option value="permanent">Permanent Ban</option>
                    <option value="temporary">Temporary Ban</option>
                  </select>
                </div>
              ))}
          </div>

          {tempBanModal && (
            
            <div className="temp-ban-modal">
               {console.log('gdgdgdg')}
              <div className="modal-content">
                <h2>Choose Ban Duration</h2>
                <label>
                  <input type="radio" name="ban-duration" value="1 month" /> 1
                  Month
                </label>
                <label>
                  <input type="radio" name="ban-duration" value="3 months" /> 3
                  Months
                </label>
                <label>
                  <input type="radio" name="ban-duration" value="6 months" /> 6
                  Months
                </label>
                <label>
                  <input type="radio" name="ban-duration" value="1 year" /> 1
                  Year
                </label>
                <div className="modal-actions">
                  <button onClick={submitBan}>Submit</button>
                  <button onClick={closeTempBanModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {permanentBanModal && (
            <div className="permanent-ban-modal">
              <div className="modal-content">
                <h2>Are you sure you want to permanently ban this user?</h2>
                <div className="modal-actions">
                  <button onClick={submitPermanentBan}>Confirm</button>
                  <button onClick={closePermanentBanModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <NavigationBar />
    </div>
    <button className="AdminLogout" onClick={handleLogout}>Logout</button>
    </div>
  );
  
};

export default AdminDashboard;
