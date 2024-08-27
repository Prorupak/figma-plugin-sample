import * as React from "react";
import { render } from "react-dom";

import "figma-plugin-types";
import "./figma-ui.min.css";
import MainPluginPage from "./components/MainPage";
import LoginPage from "./components/Login";
import { useAuthCheck, useAuthStore } from "../hooks/useAuthStore";
const App = () => {
  useAuthCheck();

  const {
    isAuthenticated,
    loading,
    startOAuthFlow,
    checkingAuthStatus,
  } = useAuthStore();

  const [showMainPlugin, setShowMainPlugin] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      setShowMainPlugin(true);
    }
  }, [isAuthenticated]);

  if (checkingAuthStatus) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (isAuthenticated && showMainPlugin) {
    return <MainPluginPage />;
  } else {
    return <LoginPage loading={loading} startOAuthFlow={startOAuthFlow} />;
  }
};

render(<App />, document.getElementById("app"));
