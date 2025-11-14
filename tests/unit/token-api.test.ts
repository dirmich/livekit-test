/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/token/route';
import { NextRequest } from 'next/server';

describe('Token API Route', () => {
  it('should return token and url for valid request', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/token?roomName=test-room&participantName=test-user'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBeDefined();
    expect(typeof data.token).toBe('string');
    expect(data.url).toBeDefined();
    expect(data.url).toBe(process.env.LIVEKIT_URL);
  });

  it('should return 400 when roomName is missing', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/token?participantName=test-user'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('roomName and participantName are required');
  });

  it('should return 400 when participantName is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/token?roomName=test-room');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('roomName and participantName are required');
  });

  it('should return 400 when both parameters are missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/token');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('roomName and participantName are required');
  });

  it('should handle metadata parameter', async () => {
    const metadata = JSON.stringify({ role: 'moderator' });
    const request = new NextRequest(
      `http://localhost:3000/api/token?roomName=test-room&participantName=test-user&metadata=${encodeURIComponent(metadata)}`
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBeDefined();
    expect(typeof data.token).toBe('string');
  });
});
