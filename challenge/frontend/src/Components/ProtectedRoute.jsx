import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  useEffect(() => {
    auth();
  }, []);
  const auth = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthorized(false);
      return;
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? children : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
