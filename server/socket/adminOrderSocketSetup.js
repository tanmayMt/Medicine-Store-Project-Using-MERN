import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * Admin-only namespace: verifies JWT and role === 1, then joins socket to `admin` room.
 */
export function setupAdminOrderSocket(io) {
  io.use(async (socket, next) => {
    try {
      const raw =
        socket.handshake.auth?.token ||
        (typeof socket.handshake.headers?.authorization === "string"
          ? socket.handshake.headers.authorization.replace(/^Bearer\s+/i, "").trim()
          : "");
      if (!raw) {
        return next(new Error("Unauthorized"));
      }
      const decode = JWT.verify(raw, process.env.JWT_SECRET);
      const user = await userModel.findById(decode._id).select("role");
      if (!user || user.role !== 1) {
        return next(new Error("Forbidden"));
      }
      socket.join("admin");
      return next();
    } catch (e) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", () => {
    // no-op; events are pushed from HTTP controllers
  });
}
