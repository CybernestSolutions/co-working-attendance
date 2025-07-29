import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null); // null = loading, true = allowed, false = denied
  const navigate = useNavigate();

  useEffect(() => {
    const verifyNetwork = async () => {
      try {
        const res = await axios.get("https://192.168.0.191:3000/api/check-network");

        if (res.data?.connected) {
          setAllowed(true); 
        } else {
          setAllowed(false);
          navigate("/404"); 
        }
      } catch (err) {
        console.error("Network verification failed:", err);
        setAllowed(false);
        navigate("/404");
      }
    };

    verifyNetwork();
  }, [navigate]);

  if (allowed === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 font-[montserrat] text-md">Checking Network Access...</p>
      </div>
    );
  }

  return allowed ? children : null;
}
