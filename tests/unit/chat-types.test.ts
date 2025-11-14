/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import type { ChatMessage } from '@/types/livekit';

describe('Chat Message Type', () => {
  it('should be importable from types module', () => {
    // This test verifies the type exists and can be imported
    const createMessage = (msg: ChatMessage): ChatMessage => msg;
    const message = createMessage({
      id: '1',
      senderId: 'user1',
      senderName: 'User 1',
      message: 'Hello',
      timestamp: Date.now(),
    });
    expect(message).toBeDefined();
  });


  it('should have required fields', () => {
    const message: ChatMessage = {
      id: '1',
      senderId: 'user1',
      senderName: 'User 1',
      message: 'Hello',
      timestamp: Date.now(),
    };

    expect(message.id).toBeDefined();
    expect(message.senderId).toBeDefined();
    expect(message.senderName).toBeDefined();
    expect(message.message).toBeDefined();
    expect(message.timestamp).toBeDefined();
  });

  it('should have correct field types', () => {
    const message: ChatMessage = {
      id: 'msg-123',
      senderId: 'user-456',
      senderName: 'Test User',
      message: 'Test message',
      timestamp: 1234567890,
    };

    expect(typeof message.id).toBe('string');
    expect(typeof message.senderId).toBe('string');
    expect(typeof message.senderName).toBe('string');
    expect(typeof message.message).toBe('string');
    expect(typeof message.timestamp).toBe('number');
  });

  it('should allow empty message content', () => {
    const message: ChatMessage = {
      id: '1',
      senderId: 'user1',
      senderName: 'User 1',
      message: '',
      timestamp: Date.now(),
    };

    expect(message.message).toBe('');
  });
});
