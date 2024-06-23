import React, { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import Chat from "./Chat";

const Home = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <div className="d-flex mt-5 mb-3 align-items-center">
        <h2 className="text-primary">Dine Bot</h2>
        <button
          className="btn btn-sm btn-secondary ms-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <Chat />
    </div>
  );
};

export default Home;
