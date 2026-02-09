import { Link } from '@forgedevstack/forge-compass';
import type { RouteComponentProps } from '@forgedevstack/forge-compass';

export const UnauthorizedPage = ({ route }: RouteComponentProps) => {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
      <h1 style={{ color: '#ef4444' }}>Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: 24 }}>
        Go Home
      </Link>
    </div>
  );
};

