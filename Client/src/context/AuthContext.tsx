import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import AuthReducer, { AuthState, initialState } from "../context/AuthReducer";

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // UseEffect to initialize the authentication state from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

  if (token && user) {
    dispatch({ type: "LOGIN_SUCCESS", payload: { user: JSON.parse(user) } });
  } else {
    dispatch({ type: "LOGOUT" });
  }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
