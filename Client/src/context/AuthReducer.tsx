export type AuthState = {
  user: { username: string; email: string } | null;
  isFetching: boolean;
  error: boolean | string;
};

export const initialState: AuthState = {
  user: null,
  isFetching: false,
  error: false,
};

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: { name: string; email: string } } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" };

const AuthReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isFetching: true, error: false };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user, isFetching: false, error: false };
    case "LOGIN_FAILURE":
      return { ...state, user: null, isFetching: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isFetching: false, error: false };
    default:
      return state;
  }
};

export default AuthReducer;
