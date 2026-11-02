// Puts the owner's notes (/notes/: scores, evidence, competitors, pricing,
// reviews) behind HTTP Basic auth. Netlify's own password protection is a
// paid feature; this edge function is the free equivalent, the same approach
// as pisanuw/dashboards.
//
// Set NOTES_PASSWORD (and optionally NOTES_USER, default "yusuf") in the
// site's environment variables. Unlike the dashboard, this fails CLOSED: with
// no password set, /notes/ is refused, never served open.

const REALM = 'Daily Project Ideas notes';

// Compares without leaking the position of the first mismatch through timing.
export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function check(authorization, user, password) {
  if (!password) return 'unconfigured';
  const expected = `Basic ${btoa(`${user}:${password}`)}`;
  return timingSafeEqual(authorization || '', expected) ? 'ok' : 'denied';
}

export default async (request) => {
  const env = globalThis.Netlify ? globalThis.Netlify.env : { get: () => undefined };
  const result = check(
    request.headers.get('authorization'),
    env.get('NOTES_USER') || 'yusuf',
    env.get('NOTES_PASSWORD'),
  );
  if (result === 'ok') return; // Continue to the static file.
  if (result === 'unconfigured') {
    return new Response('Notes are not configured (NOTES_PASSWORD is not set).\n', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  return new Response('Authentication required.\n', {
    status: 401,
    headers: {
      'www-authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};

// Paths are declared in netlify.toml ([[edge_functions]]), not here, so there
// is one place that says what is protected.
