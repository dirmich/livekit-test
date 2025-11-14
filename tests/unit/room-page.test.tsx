import { describe, it, expect } from 'vitest';
import RoomPage from '@/app/room/[roomName]/page';

describe('Video Room Page', () => {
  it('should export RoomPage component', () => {
    expect(RoomPage).toBeDefined();
    expect(typeof RoomPage).toBe('function');
  });

  it('should be a default export', () => {
    // Verify the component is properly exported as default
    expect(RoomPage.name).toBe('RoomPage');
  });
});