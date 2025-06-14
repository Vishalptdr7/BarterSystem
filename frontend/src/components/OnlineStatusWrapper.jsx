// src/components/OnlineStatusWrapper.jsx
import { useEffect, useState } from "react";
import NotFoundPage from "./NotFoundPage";

const OnlineStatusWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline ? children : <NotFoundPage />;
};

export default OnlineStatusWrapper;
