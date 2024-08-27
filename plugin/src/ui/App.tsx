import * as React from "react";
import { render } from "react-dom";

import "figma-plugin-types";
import "./figma-ui.min.css";
import MainPluginPage from "./components/MainPage";
import SuccessPage from "./components/SuccessPage";
import LoginPage from "./components/Login";
import { useAuthCheck, useAuthStore } from "../hooks/useAuthStore";
const App = () => {
  useAuthCheck();

  const {
    isAuthenticated,
    loading,
    startOAuthFlow,
    checkingAuthStatus,
    isNewLogin,
  } = useAuthStore();

  const [showMainPlugin, setShowMainPlugin] = React.useState(false);

  const handleRedirect = () => {
    setShowMainPlugin(true);
  };

  React.useEffect(() => {
    if (isAuthenticated && !isNewLogin) {
      setShowMainPlugin(true);
    }
  }, [isAuthenticated, isNewLogin]);

  if (checkingAuthStatus) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (isAuthenticated && showMainPlugin) {
    return <MainPluginPage />;
  } else if (isAuthenticated && isNewLogin) {
    return <SuccessPage onRedirect={handleRedirect} />;
  } else {
    return <LoginPage loading={loading} startOAuthFlow={startOAuthFlow} />;
  }
};

render(<App />, document.getElementById("app"));
