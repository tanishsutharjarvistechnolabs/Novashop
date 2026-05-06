import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { useLoaderStore } from "@/stores/useLoaderStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiErrorResponse = {
  statusCode?: number;
};

let isSessionExpired = false;

let isTokenReady = false;
let tokenReadyQueue: Array<() => void> = [];

const waitForToken = (timeoutMs = 10000): Promise<void> =>
  new Promise((resolve, reject) => {
    if (isTokenReady) return resolve();
    const timer = setTimeout(() => {
      reject(new axios.CanceledError("Token wait timeout"));
    }, timeoutMs);
    tokenReadyQueue.push(() => {
      clearTimeout(timer);
      resolve();
    });
  });

export const flushTokenQueue = () => {
  isTokenReady = true;
  tokenReadyQueue.forEach((resolve) => resolve());
  tokenReadyQueue = [];
};

export const resetTokenReady = () => {
  isTokenReady = false;
  tokenReadyQueue = [];
};

const pendingRequests = new Map<AbortController, string>();
const requestControllers = new WeakMap<object, AbortController>();

const PUBLIC_ROUTES = [
  "/Auth/generatepublictoken"
];

const SKIP_LOADER_ROUTES = [
  "/Auth/generatepublictoken",
  "/Mpesa/InitiatePayment",
  "/Mpesa/TransactionByOrder"
];

const hasAuthorizationHeader = (headers: unknown) => {
  if (!headers) {
    return false;
  }

  if (typeof (headers as { get?: unknown }).get === "function") {
    const authValue = (
      headers as { get: (key: string) => string | undefined }
    ).get("Authorization");
    return Boolean(authValue);
  }

  const plainHeaders = headers as Record<string, string | undefined>;
  return Boolean(plainHeaders.Authorization ?? plainHeaders.authorization);
};

export const cancelAllPendingRequests = (skipPublic = false) => {
  pendingRequests.forEach((url, controller) => {
    if (skipPublic && PUBLIC_ROUTES.some((route) => url.includes(route))) return;
    controller.abort();
    pendingRequests.delete(controller);
  });
};

export const resetSessionExpired = () => {
  isSessionExpired = false;
};

const clearPendingRequest = (config?: object) => {
  if (!config) {
    return;
  }

  const controller = requestControllers.get(config);

  if (!controller) {
    return;
  }

  pendingRequests.delete(controller);
  requestControllers.delete(config);
};

const handleSessionExpired = () => {
  if (typeof window === "undefined" || isSessionExpired) {
    return;
  }

  isSessionExpired = true;
  cancelAllPendingRequests(true);
  useAuthStore.getState().auth.reset();
};

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const isPublic = PUBLIC_ROUTES.some((route) =>
      config.url?.includes(route)
    );

    if (!isPublic && isSessionExpired) {
      return Promise.reject(new axios.CanceledError("Session expired"));
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(controller, config.url ?? "");
    requestControllers.set(config, controller);

    let token = useAuthStore.getState().auth.accessToken;

    if (!isPublic && !token) {
      try {
        await waitForToken();
        token = useAuthStore.getState().auth.accessToken;
      } catch {
        pendingRequests.delete(controller);
        requestControllers.delete(config);
        useLoaderStore.getState().setLoading(false);
        return Promise.reject(new axios.CanceledError("Token unavailable"));
      }
    }

    if (!hasAuthorizationHeader(config.headers) && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["x-signin-from"] = "WEBSITE";

    const shouldSkipLoader = SKIP_LOADER_ROUTES.some((route) =>
      config.url?.includes(route)
    );
    if (!shouldSkipLoader) useLoaderStore.getState().setLoading(true);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    clearPendingRequest(response.config);

    const shouldSkipLoader = SKIP_LOADER_ROUTES.some((route) =>
      response.config.url?.includes(route)
    );
    if (!shouldSkipLoader) {
      useLoaderStore.getState().setLoading(false);
    }

    return response;
  },
  (error) => {
    if (error && error.config) {
      clearPendingRequest(error.config);
      const shouldSkipLoader = SKIP_LOADER_ROUTES.some((route) =>
        error.config.url?.includes(route)
      );
      if (!shouldSkipLoader) {
        useLoaderStore.getState().setLoading(false);
      }
    }

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const payload =
      error && error.response && error.response.data
        ? (error.response.data as ApiErrorResponse)
        : {};

    const status =
      error && error.response && typeof error.response.status !== "undefined"
        ? Number(error.response.status)
        : NaN;

    const statusCode =
      Number.isFinite(payload.statusCode) && Number(payload.statusCode) > 0
        ? Number(payload.statusCode)
        : status;

    const requestUrl =
      error && error.config && error.config.url ? String(error.config.url) : "";

    const isAdminSignInRequest = requestUrl.includes("/Login/verify-otp");

    const isPublicRequest = PUBLIC_ROUTES.some((route) =>
      requestUrl.includes(route)
    );

    if ((statusCode === 401 || statusCode === 440) && !isAdminSignInRequest && !isPublicRequest) {
      handleSessionExpired();
    }

    if (statusCode === 503) {
      window.location.href = "/errors/maintenance-error";
    }

    return Promise.reject(error);
  }
);
