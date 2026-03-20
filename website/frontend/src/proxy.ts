import { NextRequest, NextResponse } from 'next/server';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN ??
  (process.env.NODE_ENV === 'production' ? 'https://parentshield.app' : 'http://localhost:3000');

export function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const origin = request.headers.get('origin') ?? '';

  // Handle CORS preflight
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    const res = new NextResponse(null, { status: 204 });
    setCorsHeaders(res, origin);
    res.headers.set('X-Request-Id', requestId);
    return res;
  }

  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        'x-request-id': requestId,
      }),
    },
  });

  // Security headers on all responses
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // HSTS only over HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains'
    );
  }

  // CORS headers on API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    setCorsHeaders(response, origin);
  }

  response.headers.set('X-Request-Id', requestId);
  return response;
}

function setCorsHeaders(response: NextResponse, origin: string) {
  if (origin === ALLOWED_ORIGIN || origin === 'http://localhost:3000') {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Request-Id'
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
