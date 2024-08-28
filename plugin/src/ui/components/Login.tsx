import * as React from "react";
import Logo from "./Logo";

interface LoginPageProps {
  loading: boolean;
  startOAuthFlow: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ loading, startOAuthFlow }) => {
  return (
    <div
      className="login-container"
      style={{ justifyContent: "center", height: "100vh" }}
    >
      <div className="login-card">
        <div className="logo-wrapper" style={{ marginBottom: "1rem" }}>
          <Logo />
        </div>

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
