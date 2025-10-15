import React, { useState } from 'react';
import API_BASE_URL from '../lib/api';

interface AuthHelperProps {
  onAuthSuccess: () => void;
}

const AuthHelper: React.FC<AuthHelperProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [step, setStep] = useState<'signup' | 'login' | 'createOrg' | 'complete'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [userIdFromLogin, setUserIdFromLogin] = useState(0);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          uuId: userId || `user-${Date.now()}`,
          position: 'Developer',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      setStep('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUserIdFromLogin(data.userId);
      
      if (data.status === 'NO_ORG') {
        setStep('createOrg');
      } else {
        localStorage.setItem('token', data.token);
        onAuthSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/organization/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: orgName || `Org-${Date.now()}`,
          description: 'Test organization',
          ownerId: userIdFromLogin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Organization creation failed');
      }

      const orgData = await response.json();
      const passcode = orgData.joinPasscode;
      const orgId = orgData.orgId;

      // Automatically join the organization
      await joinOrganization(orgId, passcode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const joinOrganization = async (orgId: number, passcode: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgId,
          passcode,
          userId: userIdFromLogin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join organization');
      }

      // Save token and complete setup
      localStorage.setItem('token', token);
      setStep('complete');
      setTimeout(() => {
        onAuthSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">
                {step === 'signup' && 'Create Account'}
                {step === 'login' && 'Login'}
                {step === 'createOrg' && 'Create Organization'}
                {step === 'complete' && 'Setup Complete!'}
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {step === 'signup' && (
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userId" className="form-label">User ID (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {step === 'login' && (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="loginEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              )}

              {step === 'createOrg' && (
                <form onSubmit={handleCreateOrg}>
                  <div className="mb-3">
                    <label htmlFor="orgName" className="form-label">Organization Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Creating Organization...' : 'Create Organization'}
                  </button>
                </form>
              )}

              {step === 'complete' && (
                <div className="text-center">
                  <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">Success!</h4>
                    <p>Your account and organization have been set up successfully.</p>
                    <p>Redirecting to the dashboard...</p>
                  </div>
                </div>
              )}

              <div className="mt-3 text-center">
                <small className="text-muted">
                  Step {step === 'signup' ? 1 : step === 'login' ? 2 : step === 'createOrg' ? 3 : 4} of 4
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHelper;