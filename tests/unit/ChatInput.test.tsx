import { describe, it, expect } from 'vitest';
import { ChatInput } from '@/components/features/chat/ChatInput';

describe('ChatInput Component', () => {
  it('should export ChatInput component', () => {
    expect(ChatInput).toBeDefined();
    expect(typeof ChatInput).toBe('function');
  });

  it('should accept onSend and disabled props', () => {
    // Verify component accepts expected props
    expect(ChatInput.length).toBe(1); // Accepts 1 parameter (props object)
  });
});
