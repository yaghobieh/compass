import { Link, useNavigate } from '@forgedevstack/forge-compass';
import type { RouteComponentProps } from '@forgedevstack/forge-compass';

export const HomePage = ({ route }: RouteComponentProps) => {
  const { navigate } = useNavigate();

  return (
    <div className="page">
      <h1>🧭 Forge Compass</h1>
      <p>
        Type-safe routing with guards, permissions, and declarative configuration.
        This demo showcases the key features of Forge Compass.
      </p>

      <div className="card">
        <h3>Features Demonstrated</h3>
        <ul style={{ marginTop: 16, marginLeft: 24, color: '#a1a1aa', lineHeight: 2 }}>
          <li>Array-based route configuration</li>
          <li>Authentication guards (try visiting Dashboard without login)</li>
          <li>Role-based guards (try visiting Admin as a regular user)</li>
          <li>Programmatic navigation</li>
          <li>Active link styling</li>
          <li>DevTools panel (see right side)</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button className="btn" onClick={() => navigate('/about')}>
          Learn More
        </button>
        <button className="btn protected" onClick={() => navigate('/dashboard')}>
          Try Protected Route
        </button>
      </div>
    </div>
  );
};

