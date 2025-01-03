export type User = { name: string; email: string };

export type AuthState = {
  user: User | null;
  isFetching: boolean;
  error: boolean | string;
};

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" };
