// node --test scripts/notes_auth.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler, { check } from '../netlify/edge-functions/notes-auth.js';

const basic = (u, p) => `Basic ${btoa(`${u}:${p}`)}`;
const req = (auth) => new Request('https://x/notes/', { headers: auth ? { authorization: auth } : {} });
const withEnv = (vars) => { globalThis.Netlify = { env: { get: (k) => vars[k] } }; };

test('check: right credentials pass, wrong ones are denied', () => {
  assert.equal(check(basic('yusuf', 'pw'), 'yusuf', 'pw'), 'ok');
  assert.equal(check(basic('yusuf', 'nope'), 'yusuf', 'pw'), 'denied');
  assert.equal(check(undefined, 'yusuf', 'pw'), 'denied');
});

test('no password configured fails closed', async () => {
  withEnv({});
  const res = await handler(req(basic('yusuf', '')));
  assert.equal(res.status, 503);
});

test('missing or wrong credentials get a 401 challenge', async () => {
  withEnv({ NOTES_PASSWORD: 'pw' });
  const res = await handler(req());
  assert.equal(res.status, 401);
  assert.match(res.headers.get('www-authenticate'), /^Basic realm=/);
  assert.equal((await handler(req(basic('yusuf', 'bad')))).status, 401);
});

test('right credentials continue to the page', async () => {
  withEnv({ NOTES_PASSWORD: 'pw', NOTES_USER: 'me' });
  assert.equal(await handler(req(basic('me', 'pw'))), undefined);
  assert.equal((await handler(req(basic('yusuf', 'pw')))).status, 401);
});
