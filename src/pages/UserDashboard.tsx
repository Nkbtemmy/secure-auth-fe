// src/pages/UserDashboard.tsx
import React, { useEffect, useState } from 'react';
import { getUserData, logout } from '../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/api';

interface UserStats {
    assignedTasks: number;
    completedTasks: number;
    pendingFeedback: number;
}

interface UserActivity {
    id: number;
    action: string;
    timestamp: string;
}

const UserDashboard: React.FC = () => {
  const user = getUserData() as { name?: string };
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardData();
        setStats(res.data.stats);
        setActivities(res.data.activities);
      } catch (err) {
        console.error('Failed to fetch user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
        <nav className="flex items-center space-x-4">
        <Link
          to="/profile"
          className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Logout
        </button>
        </nav>
      </div>
    </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {user.name} 👋</h2>
          <p className="text-gray-600 mt-2">Here’s a quick overview of your activity.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 uppercase">Assigned Tasks</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats?.assignedTasks || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 uppercase">Completed Tasks</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats?.completedTasks || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 uppercase">Pending Feedback</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{stats?.pendingFeedback || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          {activities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {activities.map((item) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <span>{item.action}</span>
                  <span className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
