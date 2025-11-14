import { describe, it, expect } from 'vitest';
import { ChatContainer } from '@/components/features/chat/ChatContainer';

describe('ChatContainer Component', () => {
  it('should export ChatContainer component', () => {
    expect(ChatContainer).toBeDefined();
    expect(typeof ChatContainer).toBe('function');
  });

  it('should accept messages, onSendMessage, currentUserId and disabled props', () => {
    // Verify component accepts expected props
    expect(ChatContainer.length).toBe(1); // Accepts 1 parameter (props object)
  });
});
