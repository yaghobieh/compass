import type { RouteComponentProps } from '@forgedevstack/forge-compass';

export const AdminPage = ({ route }: RouteComponentProps) => {
  return (
    <div className="page">
      <h1>Admin Panel <span className="badge warning">Admin Only</span></h1>
      <p>
        This page requires admin role. It's protected by both authentication and role guards.
      </p>

      <div className="card">
        <h3>Admin Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <button className="btn" style={{ textAlign: 'left' }}>Manage Users</button>
          <button className="btn" style={{ textAlign: 'left' }}>View Analytics</button>
          <button className="btn" style={{ textAlign: 'left' }}>System Settings</button>
        </div>
      </div>
    </div>
  );
};

