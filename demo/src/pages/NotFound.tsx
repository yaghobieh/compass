import { Link } from '@forgedevstack/forge-compass';
import type { RouteComponentProps } from '@forgedevstack/forge-compass';

export const NotFoundPage = ({ route }: RouteComponentProps) => {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1>404 - Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: 24 }}>
        Go Home
      </Link>
    </div>
  );
};

