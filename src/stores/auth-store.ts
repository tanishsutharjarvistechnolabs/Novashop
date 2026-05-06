import { create } from "zustand";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies";
import { flushTokenQueue, resetSessionExpired } from "@/lib/api/client";

const ACCESS_TOKEN = "NOVASHOP_WEBSITE_ACCESS_TOKEN";
const USER_KEY = "NOVASHOP_WEBSITE_USER";
const AUTH_TOKEN = "NOVASHOP_WEBSITE_AUTH_TOKEN";

interface AuthUser {
  name: string;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    authToken: string;
    setAuthToken: (authToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    resetAuthToken: () => void;
    reset: () => void;
  };
}

const safeParse = (value: string | undefined, fallback: any) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const useAuthStore = create<AuthState>()((set) => {
  const tokenCookie = getCookie(ACCESS_TOKEN);
  const initToken = tokenCookie ? safeParse(tokenCookie, "") : "";

  const authTokenCookie = getCookie(AUTH_TOKEN);
  const initAuthToken = authTokenCookie ?? "";

  const userCookie = getCookie(USER_KEY);
  const initUser = userCookie ? safeParse(userCookie, null) : null;

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_KEY, JSON.stringify(user));
          } else {
            removeCookie(USER_KEY);
          }

          return { ...state, auth: { ...state.auth, user } };
        }),

      accessToken: initToken,
      authToken: initAuthToken,
      setAuthToken: (authToken) =>
        set((state) => {
          setCookie(AUTH_TOKEN, authToken);
          return { ...state, auth: { ...state.auth, authToken } };
        }),
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, accessToken);
          resetSessionExpired();
          flushTokenQueue();
          return { ...state, auth: { ...state.auth, accessToken } };
        }),

      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: "" } };
        }),
      resetAuthToken: () =>
        set((state) => {
          removeCookie(AUTH_TOKEN);
          return { ...state, auth: { ...state.auth, authToken: "" } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(USER_KEY);
          removeCookie(AUTH_TOKEN);
          flushTokenQueue();
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: "" },
          };
        }),
    },
  };
});
