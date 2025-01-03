export const loginStart = () => ({ type: "LOGIN_START" });
export const loginSuccess = (user: { name: string; email: string }) => ({
  type: "LOGIN_SUCCESS",
  payload: { user },
});
export const loginFailure = (error: string) => ({ type: "LOGIN_FAILURE", payload: error });
export const logout = () => ({ type: "LOGOUT" });
