import assert from 'node:assert/strict';
import { createRoute } from '../src/utils/createRoute';
import { getComponent, registerComponent, resolveRouteComponents } from '../src/utils/componentRegistry';

const userPage = { name: 'UserPage' };
const guard = () => ({ allowed: true as const });

const missing = createRoute('auth function /auth/:id <UserPage>');
assert.equal(missing.name, 'auth');
assert.equal(missing.fn, 'function');
assert.equal(missing.path, '/auth/:id');
assert.equal(missing.component, 'UserPage');
assert.equal(getComponent('UserPage'), undefined);

const plain = createRoute('auth function /auth/:id UserPage');
assert.equal(plain.component, 'UserPage');
assert.equal(plain.path, '/auth/:id');

assert.throws(
  () => createRoute('auth function auth/:id UserPage'),
  /Invalid route spec/
);
assert.throws(
  () => createRoute('not a route'),
  /Invalid route spec/
);

const fromObject = createRoute({
  name: 'auth',
  fn: guard,
  path: '/auth/:id',
  component: 'MissingPage',
  meta: { title: 'Auth' },
});
assert.equal(fromObject.name, 'auth');
assert.equal(fromObject.fn, guard);
assert.equal(fromObject.path, '/auth/:id');
assert.equal(fromObject.component, 'MissingPage');
assert.equal(fromObject.meta?.title, 'Auth');

registerComponent('UserPage', userPage);
const resolved = createRoute('session requireUser /session/:id <UserPage>');
assert.equal(resolved.name, 'session');
assert.equal(resolved.fn, 'requireUser');
assert.equal(resolved.path, '/session/:id');
assert.equal(resolved.component, userPage);

const nested = resolveRouteComponents([
  {
    path: '/app',
    component: 'UserPage',
    children: [{ path: 'child', component: 'StillMissing' }],
  },
]);
assert.equal(nested[0].component, userPage);
assert.equal(nested[0].children?.[0].component, 'StillMissing');

const home = { name: 'Home' };
const classic = createRoute('/home', home, { name: 'home' });
assert.equal(classic.path, '/home');
assert.equal(classic.component, home);
assert.equal(classic.name, 'home');

console.log('createRoute tests passed');
