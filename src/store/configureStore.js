import { configureStore } from "@reduxjs/toolkit";
import createRootReducer from "../reducers";

// RTK's configureStore automatically includes:
// - redux-thunk middleware
// - immutability & serializability checks (dev only)
// - Redux DevTools extension support
function createAppStore(preloadedState) {
  return configureStore({
    reducer: createRootReducer(),
    preloadedState,
  });
}

export default createAppStore;
