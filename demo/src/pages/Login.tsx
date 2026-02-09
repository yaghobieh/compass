import { useState } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass';

type LoginPageProps = {
  onLogin: (role: 'user' | 'admin') => void;
};

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const { navigate } = useNavigate();
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const handleLogin = () => {
    onLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <p>Select a role to simulate login and test the guards.</p>

      <div className="card">
        <h3>Select Role</h3>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={() => setRole('user')}
            />
            <span>Regular User</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            <span>Admin</span>
          </label>
        </div>

        <button className="btn" onClick={handleLogin} style={{ marginTop: 24 }}>
          Login as {role}
        </button>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Guard Behavior</h3>
        <ul style={{ marginTop: 12, marginLeft: 24, color: '#a1a1aa', lineHeight: 1.8 }}>
          <li><strong>Dashboard, Profile:</strong> Requires login (any role)</li>
          <li><strong>Admin:</strong> Requires login AND admin role</li>
        </ul>
      </div>
    </div>
  );
};

