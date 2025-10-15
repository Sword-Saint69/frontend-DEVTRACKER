import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Todo from "../../components/Todo";
import type { ProjectResponse } from "../../types/ProjectTypes";
import API_BASE_URL from "../../lib/api";
import AuthHelper from "../../components/AuthHelper";
import { EvervaultCard, Icon } from "../../components/ui/evervault-card";
import ProjectCard from "../../components/ProjectCard";

const fetchProjects = async (): Promise<ProjectResponse[]> => {
  const token = localStorage.getItem("token");
  
  // Check if token exists
  if (!token) {
    console.error("No authentication token found in localStorage");
    throw new Error("Not authenticated. Please log in first.");
  }

  const res = await fetch(`${API_BASE_URL}/project/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(`API request failed with status ${res.status}: ${res.statusText}`);
    
    // Try to get error details from response body
    try {
      const errorText = await res.text();
      console.error("Error response body:", errorText);
      
      if (res.status === 401 || res.status === 403) {
        // Clear invalid token
        localStorage.removeItem("token");
        throw new Error("Authentication failed. Please log in again.");
      }
      
      throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}. ${errorText}`);
    } catch (e) {
      throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
    }
  }
  
  const data = await res.json();
  
  // Ensure we always return an array
  if (Array.isArray(data)) {
    return data;
  }
  
  console.error("Unexpected API response format:", data);
  return [];
};

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const [showPopup, setShowPopup] = useState(false);
  const [showAuthHelper, setShowAuthHelper] = useState(false);

  // useQuery will cache projects so it loads faster on revisit
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 2, // 2 minutes - avoids refetching immediately
  });

  const handleProjectAdded = (newProject: ProjectResponse) => {
    // Optimistically update the cache with the new project
    queryClient.setQueryData<ProjectResponse[]>(["projects"], (oldProjects = []) => {
      return [...oldProjects, newProject];
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthHelper(false);
    // Refetch projects after successful authentication
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  if (isLoading) {
    return (
      <section
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div className="container row mt-5" style={{ width: "85%" }}>
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="fw-bold">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    // Check if it's an authentication error
    const isAuthError = error.message.includes("authenticated") || 
                        error.message.includes("Authentication failed") ||
                        error.message.includes("Not authenticated");
    
    if (isAuthError && showAuthHelper) {
      return <AuthHelper onAuthSuccess={handleAuthSuccess} />;
    }
    
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center" role="alert">
              <h4 className="alert-heading">Failed to load projects</h4>
              <p>{error.message || "Please try again."}</p>
              {isAuthError && (
                <div className="mt-3">
                  <p>You may need to log in or join an organization first.</p>
                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => setShowAuthHelper(true)}
                  >
                    Setup Account
                  </button>
                  <a href="/login" className="btn btn-outline-primary">
                    Go to Login
                  </a>
                </div>
              )}
              <button 
                className="btn btn-outline-primary mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure projects is always an array before mapping
  const projectsArray = Array.isArray(projects) ? projects : [];

  return (
    <section
      className="container d-flex justify-content-center flex-column"
      style={{ height: "90vh" }}
    >
      <div className="row m-auto custom-width" style={{ height: "55%" }}>
        {/* Create Project Card - Evervault */}
        <div
          className="col-12 col-md-6 col-lg-4 p-2"
          style={{ height: "250px" }}
        >
          <div
            className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start bg-white dark:bg-slate-800 rounded-xl shadow-xl h-100 p-4 relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
            onClick={() => setShowPopup(true)}
          >
            {/* Corner Icons */}
            <Icon className="absolute h-5 w-5 -top-2.5 -left-2.5 dark:text-white text-black" />
            <Icon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 dark:text-white text-black" />
            <Icon className="absolute h-5 w-5 -top-2.5 -right-2.5 dark:text-white text-black" />
            <Icon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 dark:text-white text-black" />

            {/* Evervault Card */}
            <div className="w-full" style={{ height: "140px" }}>
              <EvervaultCard text="+" />
            </div>

            {/* Description */}
            <h5 className="text-slate-800 dark:text-slate-100 mt-2 text-base font-semibold">
              Create Project
            </h5>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
              Click to create your new project
            </p>
            
            {/* Badge */}
            <span className="text-xs border font-medium dark:border-white/[0.2] border-black/[0.2] rounded-full text-black dark:text-white px-3 py-1 bg-blue-50 dark:bg-blue-900/20">
              Add Project
            </span>
          </div>
        </div>

        {/* Project Cards */}
        {projectsArray.map((proj) => (
          <div
            key={proj.projectId}
            className="col-12 col-md-6 col-lg-4 p-2"
            style={{ height: "250px" }}
          >
            <ProjectCard project={proj} />
          </div>
        ))}

        <div
          className="col-12 col-md-6 col-lg-4 p-2"
          style={{ height: "100px" }}
        >
          <div className="custom-card rounded-4 h-100 p-3"></div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Todo
          onClose={() => setShowPopup(false)}
          onProjectAdded={handleProjectAdded}
        />
      )}
    </section>
  );
};

export default Home;