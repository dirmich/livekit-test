/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { generateToken } from '@/lib/livekit/token';

describe('LiveKit Token Generation', () => {
  it('should generate valid token', async () => {
    const token = await generateToken('test-room', 'test-user');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should generate different tokens for different users', async () => {
    const token1 = await generateToken('test-room', 'user1');
    const token2 = await generateToken('test-room', 'user2');
    expect(token1).not.toBe(token2);
  });

  it('should generate different tokens for different rooms', async () => {
    const token1 = await generateToken('room1', 'test-user');
    const token2 = await generateToken('room2', 'test-user');
    expect(token1).not.toBe(token2);
  });

  it('should generate token with metadata when provided', async () => {
    const metadata = JSON.stringify({ role: 'admin' });
    const token = await generateToken('test-room', 'test-user', metadata);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should generate valid JWT format token', async () => {
    const token = await generateToken('test-room', 'test-user');
    // JWT format: header.payload.signature (3 parts separated by dots)
    const parts = token.split('.');
    expect(parts.length).toBe(3);
  });
});
