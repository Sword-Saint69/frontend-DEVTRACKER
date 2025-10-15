import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { ProjectResponse } from "../types/ProjectTypes";
import { Link } from "react-router-dom";
import API_BASE_URL from "../lib/api";
import { Search } from "lucide-react";

interface ProjectSearchProps {
  onSelect?: (projectName: string) => void;
}

export default function ProjectSearch({ onSelect }: ProjectSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const cancelTokenRef = useRef<any>(null);

  const highlightQuery = (name: string) => {
    const parts = name.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold rounded px-1">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFilteredProjects([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch projects
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProjects([]);
      setLoading(false);
      return;
    }

    const rawToken = localStorage.getItem("token");
    const token = rawToken?.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;
    if (!token) return;

    if (cancelTokenRef.current) cancelTokenRef.current.cancel();
    const source = axios.CancelToken.source();
    cancelTokenRef.current = source;

    setLoading(true);
    axios
      .get<ProjectResponse[]>(`${API_BASE_URL}/project/search`, {
        params: { keyword: searchQuery },
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token,
      })
      .then((res) => setFilteredProjects(res.data))
      .catch((err) => {
        if (!axios.isCancel(err)) console.error(err);
      })
      .finally(() => {
        if (cancelTokenRef.current === source) setLoading(false);
      });

    return () => {
      source.cancel();
    };
  }, [searchQuery]);

  return (
    <div className="position-relative w-100" ref={searchRef}>
      <div className="position-relative">
        <Search className="position-absolute text-slate-400 dark:text-slate-500" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px" }} />
        <input
          type="text"
          placeholder="Search projects..."
          className="d-none d-md-block rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2 pl-10 pr-4 w-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Dropdown */}
      {(filteredProjects.length > 0 || loading || searchQuery) && (
        <ul
          className="list-unstyled position-absolute bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mt-2"
          style={{
            top: "100%",
            width: "100%",
            maxHeight: "280px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {loading ? (
            <li className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading...</span>
              </div>
            </li>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link
                to={`/projects/${project.projectId}`}
                className="text-decoration-none"
                onClick={() => setSearchQuery("")}
                key={project.projectId}
              >
                <li
                  className="px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 border-b border-slate-100 dark:border-slate-700 last:border-0 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(project.projectName);
                    setFilteredProjects([]);
                    if (onSelect) onSelect(project.projectName);
                  }}
                >
                  {highlightQuery(project.projectName)}
                </li>
              </Link>
            ))
          ) : (
            <li className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
              No projects found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
