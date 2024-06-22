import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./Contexts/AuthContext";
import Home from "./Components/Home";
import LoginPage from "./Components/LoginPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" />;
};

export default App;
