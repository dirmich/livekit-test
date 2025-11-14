/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { config } from '@/lib/config';

describe('Config', () => {
  it('should load LiveKit configuration', () => {
    expect(config.livekit.url).toBeDefined();
    expect(config.livekit.apiKey).toBeDefined();
    expect(config.livekit.apiSecret).toBeDefined();
  });

  it('should have valid LiveKit URL format', () => {
    expect(config.livekit.url).toBeTruthy();
    expect(typeof config.livekit.url).toBe('string');
  });

  it('should have valid LiveKit API key', () => {
    expect(config.livekit.apiKey).toBeTruthy();
    expect(typeof config.livekit.apiKey).toBe('string');
  });

  it('should have valid LiveKit API secret', () => {
    expect(config.livekit.apiSecret).toBeTruthy();
    expect(typeof config.livekit.apiSecret).toBe('string');
  });
});
