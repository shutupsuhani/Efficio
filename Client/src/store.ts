// store.ts
import { createStore, combineReducers } from "redux";
import AuthReducer from "./context/AuthReducer";

// Define the shape of the AuthReducer state
type AuthState = {
  user: { username: string; email: string } | null;
  isFetching: boolean;
  error: boolean | string;
};

// Define the root state type
type RootState = {
  user: AuthState;
};

// Combine reducers (if you have more than one)
const rootReducer = combineReducers<RootState>({
  user: AuthReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;

// Export RootState type for usage in selectors and throughout the app
export type { RootState };
