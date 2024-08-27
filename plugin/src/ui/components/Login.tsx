import * as React from "react";

interface LoginPageProps {
  loading: boolean;
  startOAuthFlow: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ loading, startOAuthFlow }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">You are logged out</h2>
        <p className="login-subtitle">
          Please login to start using plugin again.
        </p>
        <button
          className={`login-button ${loading ? "loading" : ""}`}
          onClick={startOAuthFlow}
          disabled={loading}
        >
          {loading ? <span className="spinner"></span> : "Log in with Figma"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
