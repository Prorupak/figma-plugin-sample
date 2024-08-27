import { create } from "zustand";
import { useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  checkingAuthStatus: boolean;
  isNewLogin: boolean;
  startOAuthFlow: () => void;
  checkSession: (userId: string) => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  setIsNewLogin: (value: boolean) => void;
  setCheckingAuthStatus: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: false,
  checkingAuthStatus: true,
  isNewLogin: false,

  setCheckingAuthStatus: (value: boolean) => {
    return set({ checkingAuthStatus: value });
  },

  startOAuthFlow: async () => {
    set({ loading: true, checkingAuthStatus: false });

    const keysResponse = await fetch("http://localhost:3000/generate-keys");
    const { readKey, writeKey } = await keysResponse.json();

    window.open(`http://localhost:3000/auth?writeKey=${writeKey}`, "_blank");

    const pollForToken = async (retryCount = 0) => {
      const pollResponse = await fetch(
        `http://localhost:3000/poll?readKey=${readKey}&writeKey=${writeKey}`
      );
      if (pollResponse.ok) {
        const { userId, user } = await pollResponse.json();
        parent.postMessage(
          {
            pluginMessage: {
              type: "store-token",
              token: user?.token,
              userId,
            },
          },
          "*"
        );
        set({
          isAuthenticated: true,
          isNewLogin: true,
          loading: false,
        });
      } else if (retryCount < 15) {
        setTimeout(
          () => pollForToken(retryCount + 1),
          Math.pow(2, retryCount) * 1000
        );
      } else {
        set({ loading: false });
        console.error("Failed to retrieve token after multiple attempts.");
      }
    };

    pollForToken();
  },

  checkSession: async (userId: string) => {
    const response = await fetch(
      `http://localhost:3000/check-session?userId=${userId}`
    );
    const session = await response.json();

    if (session) {
      set({ isAuthenticated: true, loading: false });
    }
  },

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setIsNewLogin: (value: boolean) => set({ isNewLogin: value }),
}));

// Hook to handle the initial authentication check
export const useAuthCheck = () => {
  const { setCheckingAuthStatus } = useAuthStore();

  useEffect(() => {
    window.onmessage = async (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "auth-info") {
        if (msg?.data?.token) {
          const checkSession = useAuthStore.getState().checkSession;
          await checkSession(msg?.data?.userId);
        }
      }
      console.log({ msg });
      setCheckingAuthStatus(false);
    };

    window.parent.postMessage(
      { pluginMessage: { type: "fetch-initial-data" } },
      "*"
    );
  }, []);
};
