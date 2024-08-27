import * as React from "react";
import { useEffect, useState } from "react";

interface SuccessPageProps {
  onRedirect: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onRedirect }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      onRedirect();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [onRedirect]);

  return (
    <div className="login-container">
      <div className="login-card">
        <p className="login-success">You are successfully authenticated!</p>
        <p className="redirect-message">Redirecting in {countdown}...</p>
      </div>
    </div>
  );
};

export default SuccessPage;
