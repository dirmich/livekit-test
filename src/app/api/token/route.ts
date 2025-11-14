import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/livekit/token';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomName = searchParams.get('roomName');
  const participantName = searchParams.get('participantName');
  const metadata = searchParams.get('metadata');

  if (!roomName || !participantName) {
    return NextResponse.json(
      { error: 'roomName and participantName are required' },
      { status: 400 }
    );
  }

  try {
    const token = await generateToken(roomName, participantName, metadata || undefined);
    return NextResponse.json({
      token,
      url: config.livekit.url,
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
