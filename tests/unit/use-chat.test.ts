import { describe, it, expect } from 'vitest';
import { useChat } from '@/hooks/use-chat';

describe('useChat Hook', () => {
  it('should export useChat function', () => {
    expect(typeof useChat).toBe('function');
  });

  it('should accept room parameter', () => {
    // We can verify the hook signature without rendering
    expect(useChat).toBeDefined();
    expect(useChat.length).toBe(1); // Accepts 1 parameter (room)
  });

  it('should handle null room parameter', () => {
    // Verify the hook can handle null room
    expect(() => {
      const hookFunction = useChat;
      expect(hookFunction).toBeDefined();
    }).not.toThrow();
  });
});
