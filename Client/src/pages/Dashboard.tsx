import Navbar from "@/components/ui/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { CaretDoubleRight, List } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@chakra-ui/react";
import { House, Loader2Icon } from "lucide-react";


// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PendingStats {
  totalLapsed: number;
  totalBalance: number;
  groupedByPriority: Record<string, { lapsed: number; balance: number }>;
}

interface DashboardData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completedPercent: string;
  pendingPercent: string;
  pendingStats: PendingStats;
  averageCompletionTime: string;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {state}=useAuth();
  const {user}=state;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch("https://efficio-server.vercel.app/api/file/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError("Error fetching dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <div className="flex mt-3 justify-center items-center"><img src="./lg.svg" alt="logo" className="animate-spin"/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData) {
    return <div>Error loading dashboard.</div>;
  }

  // Pie chart data
  const pieData = {
    labels: ["Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        data: [dashboardData.completedTasks, dashboardData.pendingTasks],
        backgroundColor: ["#4CAF50", "#FFEB3B"],
        hoverBackgroundColor: ["#45A049", "#FFC107"],
      },
    ],
  };

  return (
    <div className="bg-white scroll-m-3 text-gray-700 font-mono">
      <Navbar />

      <div className="flex shadow-md justify-start p-5 space-x-5">

        <Button className="text-blue-600"><House size={32} /></Button>
         <Button><CaretDoubleRight size={32} /></Button>
        <Link to={'/tasklist'} ><Button className="text-blue-600"><List size={32} /></Button></Link>
      </div>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome @{user?.username}, to Your Dashboard!</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium">Total Tasks</h3>
              <p className="text-2xl font-bold">{dashboardData.totalTasks}</p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium">Completed Tasks</h3>
              <p className="text-2xl font-bold">{dashboardData.completedTasks}</p>
              <p className="text-sm text-gray-800">
                {dashboardData.completedPercent}% completed
              </p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium">Pending Tasks</h3>
              <p className="text-2xl font-bold">{dashboardData.pendingTasks}</p>
              <p className="text-sm text-gray-500">
                {dashboardData.pendingPercent}% pending
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Task Distribution</h3>
            <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
              <Pie data={pieData} />
            </div>
          </div>


          <div className="mt-6">
            <div className="bg-fuchsia-200 p-10 rounded-md">
            <h3 className="text-xl font-semibold">Pending Task Statistics</h3>
            <p>Total Lapsed Time: {dashboardData.pendingStats.totalLapsed} hours</p>
            <p>Total Balance Time: {dashboardData.pendingStats.totalBalance} hours</p>
            </div>
           
          </div>

          <div className="bg-orange-200  rounded-md">
            <div className="mt-6 p-5">
              <h3 className="text-xl font-semibold">Average Task Completion Time</h3>
              <p className="text-lg">{dashboardData.averageCompletionTime} hours</p>
            </div>
          </div>


          <div className="mt-6">
            <h3 className="text-xl font-semibold">Pending Task Statistics</h3>
            <p>Total Lapsed Time: {dashboardData.pendingStats.totalLapsed} hours</p>
            <p>Total Balance Time: {dashboardData.pendingStats.totalBalance} hours</p>

            <div className="mt-4">
              <h4 className="text-lg font-medium">Grouped by Priority</h4>

              {/* Styled Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 border border-gray-300 text-left">Task Priority</th>
                      <th className="px-6 py-3 border border-gray-300 text-left">Pending Tasks</th>
                      <th className="px-6 py-3 border border-gray-300 text-left">Time Lapsed (hrs)</th>
                      <th className="px-6 py-3 border border-gray-300 text-left">Time to Finish (hrs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dashboardData.pendingStats.groupedByPriority).map(
                      ([priority, stats], index) => (
                        <tr
                          key={priority}
                          className={
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } /* Alternating row colors */
                        >
                          <td className="px-6 py-3 border border-gray-300">{priority}</td>
                          <td className="px-6 py-3 border border-gray-300">
                            {stats.lapsed + stats.balance}
                          </td>
                          <td className="px-6 py-3 border border-gray-300">{stats.lapsed}</td>
                          <td className="px-6 py-3 border border-gray-300">{stats.balance}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>



        </div>



      </div>
    </div>
  );
};

export default Dashboard;