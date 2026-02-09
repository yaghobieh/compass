import type { RouteComponentProps } from '@forgedevstack/forge-compass';
import { NavLink, Outlet } from '@forgedevstack/forge-compass';

export const DashboardLayout = ({ route, children }: RouteComponentProps) => {
  return (
    <div className="page">
      <h1>Dashboard <span className="badge success">Protected</span></h1>
      <p>
        Welcome to the dashboard! This page is protected by an authentication guard.
      </p>

      <nav className="sub-nav">
        <NavLink to="/dashboard" exact activeClassName="active">Overview</NavLink>
        <NavLink to="/dashboard/analytics" activeClassName="active">Analytics</NavLink>
        <NavLink to="/dashboard/settings" activeClassName="active">Settings</NavLink>
      </nav>

      <div className="dashboard-content">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  return (
    <div className="card">
      <h3>Quick Stats</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
        <div style={{ textAlign: 'center', padding: 16, background: '#27272a', borderRadius: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>42</div>
          <div style={{ color: '#71717a', marginTop: 4 }}>Active Users</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: '#27272a', borderRadius: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>128</div>
          <div style={{ color: '#71717a', marginTop: 4 }}>Total Routes</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: '#27272a', borderRadius: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>99.9%</div>
          <div style={{ color: '#71717a', marginTop: 4 }}>Uptime</div>
        </div>
      </div>
    </div>
  );
};

export const DashboardAnalytics = () => {
  return (
    <div className="card">
      <h3>Analytics</h3>
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 8, background: '#27272a', borderRadius: 4 }}>
            <div style={{ width: '75%', height: '100%', background: '#3b82f6', borderRadius: 4 }} />
          </div>
          <span style={{ color: '#71717a' }}>Page Views: 75%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 8, background: '#27272a', borderRadius: 4 }}>
            <div style={{ width: '60%', height: '100%', background: '#10b981', borderRadius: 4 }} />
          </div>
          <span style={{ color: '#71717a' }}>Conversions: 60%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 8, background: '#27272a', borderRadius: 4 }}>
            <div style={{ width: '45%', height: '100%', background: '#f59e0b', borderRadius: 4 }} />
          </div>
          <span style={{ color: '#71717a' }}>Bounce Rate: 45%</span>
        </div>
      </div>
    </div>
  );
};

export const DashboardSettings = () => {
  return (
    <div className="card">
      <h3>Settings</h3>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" defaultChecked />
          <span>Enable notifications</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" defaultChecked />
          <span>Dark mode</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" />
          <span>Auto-refresh data</span>
        </label>
      </div>
    </div>
  );
};

export const DashboardPage = DashboardLayout;
