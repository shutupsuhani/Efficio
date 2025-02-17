import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import { useAuth } from "./context/AuthContext"; // Use your context
import { LoaderCircle } from "lucide-react";

function App() {
  const { state } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (state.user !== undefined) {
      setLoading(false);
    }
  }, [state.user]);

  const ProtectedRoute = ({ component: Component }: { component: JSX.Element }) => {
    if (state.user === undefined) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <img alt="logo" src="./lg.svg" className="animate-spin  w-10 h-10" />
        </div>
      );
    }

    return state.user ? Component : <Navigate to="/register" replace />;
  };

  return (
    <div className="scrollbar-hide">
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <LoaderCircle className="text-yellow-600 animate-spin w-16 h-16 mb-4" />
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute component={<Dashboard />} />} />
            <Route path="/tasklist" element={<ProtectedRoute component={<TaskList />} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;