import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "./auth";

const AdminOrderAlertsContext = createContext(null);

const apiBase = process.env.REACT_APP_API_BASE_URL || "";

export function AdminOrderAlertsProvider({ children }) {
  const [auth] = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchSeq = useRef(0);

  const isAdmin = auth?.user?.role === 1;

  const fetchUnreadCount = useCallback(async () => {
    if (!isAdmin || !auth?.token) {
      setUnreadCount(0);
      return;
    }
    const id = ++fetchSeq.current;
    try {
      const { data } = await axios.get(
        `${apiBase}/api/v1/auth/orders/admin-unread-count`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (id !== fetchSeq.current) return;
      setUnreadCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      if (id !== fetchSeq.current) return;
      setUnreadCount(0);
    }
  }, [isAdmin, auth?.token]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!isAdmin || !auth?.token) return undefined;

    const socket = io(apiBase, {
      auth: { token: auth.token },
      transports: ["websocket", "polling"],
    });

    const onNewOrder = () => {
      setUnreadCount((c) => c + 1);
    };

    socket.on("NEW_ORDER_CREATED", onNewOrder);

    return () => {
      socket.off("NEW_ORDER_CREATED", onNewOrder);
      socket.disconnect();
    };
  }, [isAdmin, auth?.token]);

  const value = useMemo(
    () => ({
      unreadCount,
      setUnreadCount,
      fetchUnreadCount,
    }),
    [unreadCount, fetchUnreadCount]
  );

  return (
    <AdminOrderAlertsContext.Provider value={value}>
      {children}
    </AdminOrderAlertsContext.Provider>
  );
}

export function useAdminOrderAlerts() {
  const ctx = useContext(AdminOrderAlertsContext);
  if (!ctx) {
    throw new Error("useAdminOrderAlerts must be used within AdminOrderAlertsProvider");
  }
  return ctx;
}
