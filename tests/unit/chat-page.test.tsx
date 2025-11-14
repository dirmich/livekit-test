import { describe, it, expect } from 'vitest';
import ChatPage from '@/app/(main)/chat/page';

describe('Chat Test Page', () => {
  it('should export Chat Page component', () => {
    // Test that ChatPage is exported and defined
    expect(ChatPage).toBeDefined();
    expect(typeof ChatPage).toBe('function');
  });
});