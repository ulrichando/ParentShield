import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = 'ulrichando/ParentShield';
const version = process.env.APP_VERSION || '0.2.0';
const TAG = `v${version}`;

type Params = { params: Promise<{ platform: string; fileName: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { fileName } = await params;

  const releaseUrl = `https://github.com/${GITHUB_REPO}/releases/download/${TAG}/${fileName}`;

  return NextResponse.redirect(releaseUrl, { status: 302 });
}
