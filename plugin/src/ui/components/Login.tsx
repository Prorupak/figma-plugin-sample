import * as React from "react";
import Logo from "./Logo";

interface LoginPageProps {
  loading: boolean;
  startOAuthFlow: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ loading, startOAuthFlow }) => {
  const cancelLogin = () => {
    parent.postMessage({ pluginMessage: { type: "quit" } }, "*");
  };
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
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <button
            className={`login-button ${loading ? "loading" : ""}`}
            onClick={startOAuthFlow}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Log in with Figma"}
          </button>
          {loading && (
            <button
              type="button"
              style={{
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1rem",
                color: "var(--purple-color)",
              }}
              onClick={cancelLogin}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
