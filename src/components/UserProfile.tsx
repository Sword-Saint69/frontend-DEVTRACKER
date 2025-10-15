import { CircleUserRound, Mail, Briefcase, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decodeJwt } from "jose";
import Logout from "./Logout";
import API_BASE_URL from "../lib/api";

interface UserProfileProps {
  onClose: () => void;
}

interface UserDTO {
  userId: number;
  userName: string;
  email: string;
  uuid: string;
  position: string;
}

const fetchUser = async (): Promise<UserDTO> => {
  const rawToken = localStorage.getItem("token");
  if (!rawToken) throw new Error("No JWT token found in localStorage.");

  const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

  const decoded: any = decodeJwt(token);
  const uid = decoded?.userId;
  if (!uid) throw new Error("Token does not contain userId claim.");

  const res = await axios.get<UserDTO>(
    `${API_BASE_URL}/user/${uid}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export default function UserProfile({ onClose }: UserProfileProps) {
  const { data: user, error, isLoading } = useQuery<UserDTO, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 1, // retry once on failure
  });

  return (
    <div
      className="absolute bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      style={{
        right: 0,
        top: "calc(100% + 8px)",
        width: "320px",
        zIndex: 1000,
      }}
    >
      <div className="p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error.message}</p>
          </div>
        )}
        {user && !isLoading && !error && (
          <>
            {/* Profile Avatar */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full shadow-md">
                <CircleUserRound className="w-16 h-16 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* UUID Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-mono border border-slate-200 dark:border-slate-600">
                <Shield className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{user.uuid}</span>
              </span>
            </div>
            
            {/* User Info */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                  <CircleUserRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Name</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{user.userName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                  <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate" title={user.email}>{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600/50 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Position</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{user.position}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
            
            {/* Actions */}
            <div className="space-y-2.5">
              <a 
                href="/settings" 
                className="block w-full px-4 py-2.5 text-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-all duration-200 no-underline shadow-sm hover:shadow-md"
              >
                Settings
              </a>
              <div onClick={onClose}>
                <Logout />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}