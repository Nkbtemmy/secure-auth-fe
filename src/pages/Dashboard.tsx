import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import { getUserData, logout } from '../utils/auth';

interface DashboardData {
  stats: {
    totalVisits: number;
    systemUsers: number;
    systemRoles: number;
    tasks: number;
  };
  recentActivity: Array<{
    id: number;
    action: string;
    timestamp: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const userData = getUserData() as { name?: string };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-primary-500 hover:text-primary-700">
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {userData?.name || 'User'}!
          </h2>
          <p className="text-gray-600">Here's your latest account activity</p>
        </div>

        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Visits</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{dashboardData.stats.totalVisits}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">System Users</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{dashboardData.stats.systemUsers}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">System Roles</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{dashboardData.stats.systemRoles}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tasks</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{dashboardData.stats.tasks}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              {dashboardData.recentActivity.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {dashboardData.recentActivity.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex justify-between">
                        <span className="text-gray-900">{activity.action}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent activity</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;