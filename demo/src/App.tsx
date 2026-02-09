import '@forgedevstack/bear/styles.css';
import { BearProvider } from '@forgedevstack/bear';
import { CompassProvider, Routes, NavLink, authGuard, roleGuard } from '@forgedevstack/forge-compass';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { DashboardLayout, DashboardOverview, DashboardAnalytics, DashboardSettings } from './pages/Dashboard';
import { ProfilePage } from './pages/Profile';
import { AdminPage } from './pages/Admin';
import { LoginPage } from './pages/Login';
import { UnauthorizedPage } from './pages/Unauthorized';
import { NotFoundPage } from './pages/NotFound';
import { useState } from 'react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  const routes = [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'Home - Forge Compass Demo' },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
      meta: { title: 'About - Forge Compass Demo' },
    },
    {
      path: '/login',
      name: 'login',
      element: <LoginPage onLogin={(role) => { setIsLoggedIn(true); setUserRole(role); }} />,
      meta: { title: 'Login - Forge Compass Demo' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardLayout,
      guards: [authGuard(() => isLoggedIn, '/login')],
      meta: { title: 'Dashboard - Forge Compass Demo' },
      children: [
        {
          path: '',
          name: 'dashboard-overview',
          component: DashboardOverview,
          index: true,
        },
        {
          path: 'analytics',
          name: 'dashboard-analytics',
          component: DashboardAnalytics,
          meta: { title: 'Analytics - Forge Compass Demo' },
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: DashboardSettings,
          meta: { title: 'Settings - Forge Compass Demo' },
        },
      ],
    },
    {
      path: '/profile',
      name: 'profile',
      element: <ProfilePage isLoggedIn={isLoggedIn} role={userRole} onLogout={() => setIsLoggedIn(false)} />,
      guards: [authGuard(() => isLoggedIn, '/login')],
      meta: { title: 'Profile - Forge Compass Demo' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      guards: [
        authGuard(() => isLoggedIn, '/login'),
        roleGuard(['admin'], () => userRole, '/unauthorized'),
      ],
      meta: { title: 'Admin - Forge Compass Demo' },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedPage,
      meta: { title: 'Unauthorized - Forge Compass Demo' },
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFoundPage,
    },
  ];

  return (
    <BearProvider defaultMode="dark">
      <CompassProvider routes={routes} devTools devToolsPosition="right">
        <nav className="nav">
          <NavLink to="/" exact>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
        </nav>
        <Routes />
      </CompassProvider>
    </BearProvider>
  );
};

export default App;

