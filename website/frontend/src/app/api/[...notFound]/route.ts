import { NextResponse } from 'next/server';

/**
 * Catch-all handler for unmatched /api/* routes.
 * Returns JSON instead of Next.js's default HTML 404 page, so clients
 * that call response.json() on error responses don't get a parse error.
 */
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
export async function PUT() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
export async function PATCH() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
