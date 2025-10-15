import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "@/lib/api";

export default function OrganizationPage() {
  const [mode, setMode] = useState<"join" | "create">("join"); // toggle
  const [orgId, setOrgId] = useState<number | "">("");
  const [passcode, setPasscode] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [orgDesc, setOrgDesc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleJoin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem("pendingUserId");
    if (!userId) {
      alert("No user found. Please login again.");
      navigate("/login");
      setLoading(false);
      return;
    }

    // Validate inputs
    if (orgId === "") {
      alert("Please enter a valid Organization ID");
      setLoading(false);
      return;
    }

    if (!passcode.trim()) {
      alert("Please enter the Organization Passcode");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(api.organization.join, {
        orgId: Number(orgId),
        passcode,
        userId: Number(userId),
      });

      alert("Successfully joined organization! Please login again.");
      localStorage.removeItem("pendingUserId");
      navigate("/login");
    } catch (err: any) {
      console.error("Join failed:", err);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err.response?.status === 403) {
        errorMessage = "Access denied. Please check your organization ID and passcode.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = "Organization not found. Please check the organization ID.";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request. Please check your inputs.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Organization
  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem("pendingUserId");
    if (!userId) {
      alert("No user found. Please login again.");
      navigate("/login");
      setLoading(false);
      return;
    }

    // Validate inputs
    if (!orgName.trim()) {
      alert("Please enter an Organization Name");
      setLoading(false);
      return;
    }

    if (!orgDesc.trim()) {
      alert("Please enter an Organization Description");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(api.organization.create, {
        name: orgName,
        description: orgDesc,
        ownerId: Number(userId),
      });

      const createdOrg = response.data;

      alert(
        `Organization created successfully!\n` +
        `Organization ID: ${createdOrg.orgId}\n` +
        `Join Passcode: ${createdOrg.joinPasscode}\n\n` +
        `⚠️ Please save this passcode safely — you’ll need it for others to join.`
      );

      try {
        await axios.post(api.organization.join, {
          orgId: Number(createdOrg.orgId),
          passcode: createdOrg.joinPasscode,
          userId: Number(userId),
        });
        localStorage.removeItem("pendingUserId");
        navigate("/login");
      } catch (err: any) {
        console.error("Join failed:", err);
        let errorMessage = "Something went wrong. Please try again.";
        
        if (err.response?.status === 403) {
          errorMessage = "Access denied when joining your own organization.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        alert(errorMessage);
      }

      localStorage.removeItem("pendingUserId");
      navigate("/login");
    } catch (err: any) {
      console.error("Create failed:", err);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request. Please check your inputs.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 bg-white rounded-4 shadow p-5">
          {/* Toggle Buttons */}
          <div className="d-flex justify-content-around mb-4">
            <button
              className={`btn ${mode === "join" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("join")}
              disabled={loading}
            >
              Join Organization
            </button>
            <button
              className={`btn ${mode === "create" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setMode("create")}
              disabled={loading}
            >
              Create Organization
            </button>
          </div>

          {/* Join Form */}
          {mode === "join" && (
            <form onSubmit={handleJoin}>
              <h2 className="text-center mb-3 fs-5">Join Organization</h2>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization ID"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value ? Number(e.target.value) : "")}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                className="btn btn-primary btn-lg w-100 rounded-3"
                type="submit"
                disabled={loading}
              >
                {loading ? "Joining..." : "Join"}
              </button>
            </form>
          )}

          {/* Create Form */}
          {mode === "create" && (
            <form onSubmit={handleCreate}>
              <h2 className="text-center mb-3 fs-5">Create Organization</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization Description"
                  value={orgDesc}
                  onChange={(e) => setOrgDesc(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                className="btn btn-success btn-lg w-100 rounded-3"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}