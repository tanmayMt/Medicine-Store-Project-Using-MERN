/** Holds Socket.io server instance; set from server.js after HTTP server is created. */
let ioInstance = null;

export function setAdminOrderIo(io) {
  ioInstance = io;
}

export function emitNewOrderCreated(payload) {
  if (!ioInstance) return;
  ioInstance.to("admin").emit("NEW_ORDER_CREATED", payload);
}
