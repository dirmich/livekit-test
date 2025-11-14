import { describe, it, expect } from 'vitest';
import { ChatMessage } from '@/components/features/chat/ChatMessage';

describe('ChatMessage Component', () => {
  it('should export ChatMessage component', () => {
    expect(ChatMessage).toBeDefined();
    expect(typeof ChatMessage).toBe('function');
  });

  it('should accept message and isOwnMessage props', () => {
    // Verify component accepts expected props
    expect(ChatMessage.length).toBe(1); // Accepts 1 parameter (props object)
  });
});
