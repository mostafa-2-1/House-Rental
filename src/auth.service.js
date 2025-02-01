import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

const register = async (username, phoneNumber, email, password) => {
  try {
    return await axios
      .post(API_URL + "signup", { username, phoneNumber, email, password });
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "An error occurred during registration.");
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error message:", error.message);
      throw new Error("An error occurred during registration.");
    }
  }
};



const login = async (email, password) => {
  try {
    if (!email || !password) {
      console.log('NO');
      throw new Error("Email and password are required.");
    }

    if (email === "admin1@gmail.com" && password === "admin123") {

      return {
        data: {
          token: "admin-token",
          memberId: "admin-id",
          role: "admin",
        },
      };
    }

    const response = await axios.post(API_URL + "signin", { email, password });

    return response;
  } catch (error) {
    
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "An error occurred during login.");
    }
    
    else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response from server.");
    } else {
      
      console.error("Error message:", error.message);
      throw new Error("An error occurred during login.");
    }
  }
};



const logout = async() => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};


const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;