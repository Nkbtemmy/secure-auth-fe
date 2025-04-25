import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getDashboardData,
  getUsers,
  getRoles,
  apiAddUser,
  apiUpdateUser,
  apiDeleteUser,
} from '../services/api';
import { getUserData, logout } from '../utils/auth';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardData {
  stats: {
    totalVisits: number;
    systemUsers: number;
    systemRoles: number;
    tasks: number;
    dailyVisits: { date: string; count: number }[];
  };
  recentActivity: { id: number; action: string; timestamp: string }[];
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface NewUser {
  name: string;
  email: string;
  roleId: number;
  password: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashError, setDashError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userError, setUserError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    roleId: 0,
    password: '',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const user = getUserData() as { name?: string; role?: string };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
      } catch {
        setDashError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
      } catch {
        setUserError('Unable to load users.');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await getRoles();
        setRoles(data);
      } catch {
        // Optionally handle roles fetch error
      }
    };
    fetchRoles();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await apiDeleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      setUserError('Failed to delete user.');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await apiUpdateUser(editingUser.id, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    } catch {
      setUserError('Failed to update user.');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.roleId || !newUser.password) return;
    try {
      await apiAddUser(newUser);
      window.location.reload();
    } catch {
      setUserError('Failed to add user.');
    }
  };

  // Prepare data for the roles distribution chart
  const roleDistributionData = useMemo(() => {
    const roleCount: { [key: string]: number } = {};
    users.forEach((usr) => {
      roleCount[usr.role.name] = (roleCount[usr.role.name] || 0) + 1;
    });
    return Object.keys(roleCount).map((role) => ({
      name: role,
      value: roleCount[role],
    }));
  }, [users]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (dashError) return <div className="text-red-600 text-center mt-10">{dashError}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hello, {typeof user?.name === 'string' ? user.name : 'User'}
            </span>
            <Link to="/profile" className="text-blue-600 hover:underline">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Visits', value: dashboardData?.stats.totalVisits },
            { label: 'System Users', value: dashboardData?.stats.systemUsers },
            { label: 'System Roles', value: dashboardData?.stats.systemRoles },
            { label: 'Tasks', value: dashboardData?.stats.tasks },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">{stat.label}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {dashboardData?.stats.dailyVisits?.length ? (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Visits This Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.stats.dailyVisits}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {/* New Chart: User Roles Distribution */}
        {roleDistributionData.length ? (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Roles Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={true}
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          {dashboardData?.recentActivity?.length ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentActivity.map((act) => (
                <li key={act.id} className="py-3 flex justify-between">
                  <span>{act.action}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity found.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Management</h2>
          {userError && <p className="text-red-500 mb-4">{userError}</p>}
          <table className="min-w-full divide-y divide-gray-200 mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((usr) => (
                <tr key={usr.id}>
                  <td className="px-4 py-2">{usr.name}</td>
                  <td className="px-4 py-2">{usr.email}</td>
                  <td className="px-4 py-2">{usr.role.name}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEditUser(usr)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteUser(usr.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingUser && (
            <div className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">Edit User</h3>
                <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                placeholder="Name"
                className="border p-2 mr-2"
                />
                <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                placeholder="Email"
                className="border p-2 mr-2"
                />
                <select
                value={editingUser.role.id}
                onChange={(e) =>
                  setEditingUser({
                  ...editingUser,
                  role:
                    roles.find((role) => role.id === Number(e.target.value)) ||
                    editingUser.role,
                  })
                }
                className="border p-2 mr-2"
                >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                  {role.name}
                  </option>
                ))}
                </select>
              <button
                onClick={handleUpdateUser}
                className="bg-blue-600 text-white p-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-300 text-black p-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Add New User</h3>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Name"
              className="border p-2 mr-2"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
              className="border p-2 mr-2"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Password"
              className="border p-2 mr-2"
            />
            <select
              value={newUser.roleId}
              onChange={(e) =>
                setNewUser({ ...newUser, roleId: Number(e.target.value) })
              }
              className="border p-2 mr-2"
            >
              <option value={0} disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddUser} className="bg-green-600 text-white p-2 rounded">
              Add User
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
