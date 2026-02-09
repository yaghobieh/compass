import type { RouteComponentProps } from '@forgedevstack/forge-compass';

export const AboutPage = ({ route }: RouteComponentProps) => {
  return (
    <div className="page">
      <h1>About Compass</h1>
      <p>
        Forge Compass is a lightweight, type-safe routing library for React applications.
        It provides a simple API for defining routes with guards and permissions.
      </p>

      <div className="card">
        <h3>Why Forge Compass?</h3>
        <ul style={{ marginTop: 16, marginLeft: 24, color: '#a1a1aa', lineHeight: 2 }}>
          <li><strong>Type-safe:</strong> Full TypeScript support with inferred params</li>
          <li><strong>Guards:</strong> Protect routes with async permission checks</li>
          <li><strong>Lightweight:</strong> No external dependencies</li>
          <li><strong>DevTools:</strong> Debug navigation in real-time</li>
          <li><strong>Lazy Loading:</strong> Built-in code splitting support</li>
        </ul>
      </div>

      <div className="card">
        <h3>Part of ForgeStack</h3>
        <p style={{ marginTop: 12, marginBottom: 0 }}>
          Works seamlessly with Bear UI, Forge Query, Forge Form, and Synapse.
        </p>
      </div>
    </div>
  );
};

