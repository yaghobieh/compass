import { useNavigate } from '@forgedevstack/forge-compass';

type ProfilePageProps = {
  isLoggedIn: boolean;
  role: 'user' | 'admin';
  onLogout: () => void;
};

export const ProfilePage = ({ isLoggedIn, role, onLogout }: ProfilePageProps) => {
  const { navigate } = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="page">
      <h1>Profile <span className="badge success">Protected</span></h1>
      <p>Manage your account settings and preferences.</p>

      <div className="card">
        <h3>User Information</h3>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #27272a' }}>
            <span style={{ color: '#71717a' }}>Status</span>
            <span style={{ color: '#10b981' }}>Logged In</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #27272a' }}>
            <span style={{ color: '#71717a' }}>Role</span>
            <span className={`badge ${role === 'admin' ? 'warning' : ''}`}>{role}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ color: '#71717a' }}>Email</span>
            <span>demo@forgestack.com</span>
          </div>
        </div>
      </div>

      <button className="btn protected" onClick={handleLogout} style={{ marginTop: 16 }}>
        Logout
      </button>
    </div>
  );
};

