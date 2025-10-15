import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeamMember } from "../types/ProjectTypes";
import API_BASE_URL from "../lib/api";
import { User, Building2, Eye, RefreshCw, Edit2, Save, X, Mail, Key, Shield } from "lucide-react";

interface Organization {
  id: number;
  name: string;
  creatorId: number;
}

const Settings: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<TeamMember | null>(null);

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const axiosAuthConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch user
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<TeamMember>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/user/${userId}`, axiosAuthConfig);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch organization (mocked — replace with API if you have one)
  const {
    data: org,
    isLoading: orgLoading,
    error: orgError,
  } = useQuery<Organization>({
    queryKey: ["organization"],
    queryFn: async () => {
      return { id: 1, name: "My Organization", creatorId: 1 };
    },
    staleTime: Infinity,
  });

  const updateUserMutation = useMutation({
    mutationFn: (updated: TeamMember) =>
      axios.put(
        `${API_BASE_URL}/user/update/${updated.userId}`,
        updated,
        axiosAuthConfig
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const regeneratePasscodeMutation = useMutation({
    mutationFn: () =>
      axios.post(`${API_BASE_URL}/organization/${org?.id}/regenerate/${org?.creatorId}`, {}, axiosAuthConfig),
  });

  const showPasscodeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/organization/${org?.id}/passcode/${org?.creatorId}`, axiosAuthConfig);
      // Display the passcode to the user (you might want to show it in a modal or alert)
      alert(`Your organization passcode is: ${res.data}`);
      return res.data;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updatedUser) return;
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUserUpdate = () => {
    if (updatedUser) updateUserMutation.mutate(updatedUser);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8" style={{ paddingTop: "80px" }}>
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage your account and organization preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
            {/* User Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">User Settings</h2>
                </div>
              </div>
              <div className="px-6 py-8">
                {userLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {userError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 font-medium">Failed to load user information</p>
                  </div>
                )}
                {user && (
                  <div>
                    {editMode ? (
                      <form className="space-y-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <User className="w-4 h-4" />
                            Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                            name="userName"
                            value={updatedUser?.userName ?? user.userName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Mail className="w-4 h-4" />
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                            name="email"
                            value={updatedUser?.email ?? user.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Key className="w-4 h-4" />
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                            name="password"
                            onChange={handleInputChange}
                            placeholder="Enter new password (optional)"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            onClick={handleUserUpdate}
                            disabled={updateUserMutation.isPending}
                          >
                            <Save className="w-4 h-4" />
                            {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                            onClick={() => setEditMode(false)}
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid gap-6">
                          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Name</p>
                              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{user.userName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">User ID</p>
                              <p className="text-lg font-mono text-slate-800 dark:text-slate-200 break-all">{user.uuid}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email</p>
                              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-6"
                          onClick={() => {
                            setEditMode(true);
                            setUpdatedUser(user);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Organization Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Organization Settings</h2>
                </div>
              </div>
              <div className="px-6 py-8">
                {orgLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                )}
                {orgError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 font-medium">Failed to load organization information</p>
                  </div>
                )}
                {org && user && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Organization Name</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{org.name}</p>
                      </div>
                    </div>
                    
                    {user.userId === org.creatorId && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-3">
                          As the organization creator, you can manage the organization passcode
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            onClick={() => showPasscodeMutation.mutate()}
                            disabled={showPasscodeMutation.isPending}
                          >
                            <Eye className="w-4 h-4" />
                            {showPasscodeMutation.isPending ? "Loading..." : "Show Passcode"}
                          </button>
                          <button
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            onClick={() => regeneratePasscodeMutation.mutate()}
                            disabled={regeneratePasscodeMutation.isPending}
                          >
                            <RefreshCw className="w-4 h-4" />
                            {regeneratePasscodeMutation.isPending ? "Working..." : "Regenerate Passcode"}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {user.userId !== org.creatorId && (
                      <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Only the organization creator can manage passcode settings
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;