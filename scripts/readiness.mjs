// Shared between server.mjs and the Next-bundled API route (separate module graphs): globalThis is the only channel.
const state = globalThis.__appReadiness || { ready: true, reason: undefined };
globalThis.__appReadiness = state;

export const markNotReady = (reason) => {
  state.ready = false;
  state.reason = reason;
};

export const getReadiness = () => ({
  ready: state.ready,
  reason: state.reason,
});
