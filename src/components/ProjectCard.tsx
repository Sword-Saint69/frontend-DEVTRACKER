import { Calendar, User, Users, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProjectResponse } from "../types/ProjectTypes";

interface ProjectCardProps {
  project: ProjectResponse;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Format deadline to dd/mm/yyyy
  const formatDeadline = (deadline: string | null | undefined): string => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline: string | null | undefined): number | null => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(project.deadline);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  // Get team lead name
  const teamLeadName = project.teamLeadId?.userName || project.teamLeadId?.uuid || "Unassigned";

  // Get team members count
  const teamMembersCount = project.teamMemberIds?.length || 0;

  // Generate consistent avatar colors based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-cyan-500 to-cyan-600",
      "from-teal-500 to-teal-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Link
      to={`/projects/${project.projectId}`}
      className="text-decoration-none h-100 block"
    >
      <div className="group relative h-full bg-white dark:bg-slate-800/95 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
        {/* Status Indicator Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            project.status === "ACTIVE"
              ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"
              : project.status === "COMPLETED"
              ? "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
              : "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"
          }`}
        />

        <div className="p-5 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white clamp-title group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                  {project.projectName}
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 clamp-description leading-relaxed">
                {project.projectDesc}
              </p>
            </div>
            
            {/* Status Badge */}
            <span
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shadow-sm ${
                project.status === "ACTIVE"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                  : project.status === "COMPLETED"
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50"
                  : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-700/50 my-3" />

          {/* Details Section */}
          <div className="space-y-3.5 flex-1">
            {/* Team Lead */}
            <div className="flex items-center gap-3 text-sm group/item">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 border border-blue-100 dark:border-blue-800/30 group-hover/item:scale-110 transition-transform">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                  Team Lead
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {teamLeadName}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-3 text-sm group/item">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-transform group-hover/item:scale-110 ${
                  isOverdue
                    ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 border-red-100 dark:border-red-800/30"
                    : isUrgent
                    ? "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20 border-amber-100 dark:border-amber-800/30"
                    : "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/20 border-purple-100 dark:border-purple-800/30"
                }`}
              >
                <Calendar
                  className={`w-4 h-4 ${
                    isOverdue
                      ? "text-red-600 dark:text-red-400"
                      : isUrgent
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-purple-600 dark:text-purple-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                  Deadline
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`text-sm font-semibold ${
                      isOverdue
                        ? "text-red-600 dark:text-red-400"
                        : isUrgent
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {formatDeadline(project.deadline)}
                  </p>
                  {daysLeft !== null && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-semibold shadow-sm ${
                        isOverdue
                          ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800/50"
                          : isUrgent
                          ? "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                          : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {isOverdue
                        ? `${Math.abs(daysLeft)}d overdue`
                        : `${daysLeft}d left`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Team Members */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 group/team">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 group-hover/team:scale-110 transition-transform">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                    Team+
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {teamMembersCount} {teamMembersCount === 1 ? "Member" : "Members"}
                  </p>
                </div>
              </div>

              {/* Team Members Avatars */}
              {teamMembersCount > 0 && (
                <div className="flex -space-x-2.5">
                  {project.teamMemberIds.slice(0, 3).map((member, index) => {
                    const memberName = member.userName || member.uuid || "?";
                    return (
                      <div
                        key={member.uuid || index}
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(memberName)} border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-110 hover:z-10 transition-transform cursor-pointer`}
                        title={memberName}
                      >
                        {memberName.charAt(0).toUpperCase()}
                      </div>
                    );
                  })}
                  {teamMembersCount > 3 && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white dark:text-slate-200 text-xs font-bold shadow-md hover:scale-110 hover:z-10 transition-transform cursor-pointer" title={`+${teamMembersCount - 3} more members`}>
                      +{teamMembersCount - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/[0.03] group-hover:via-purple-500/[0.02] group-hover:to-pink-500/[0.03] transition-all duration-500 pointer-events-none rounded-2xl" />
        
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
