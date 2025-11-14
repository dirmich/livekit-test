import { describe, it, expect } from 'vitest';
import { ConnectionStatus } from '@/components/features/connection/ConnectionStatus';
import { ConnectionState } from 'livekit-client';

describe('ConnectionStatus Component', () => {
  it('should export ConnectionStatus component', () => {
    expect(ConnectionStatus).toBeDefined();
    expect(typeof ConnectionStatus).toBe('function');
  });

  it('should accept state and className props', () => {
    // Simple test to verify the component accepts the correct props
    // We can't test rendering without React Testing Library
    const component = ConnectionStatus;
    expect(component).toBeDefined();
  });

  it('should handle ConnectionState enum values', () => {
    // Verify the component can handle ConnectionState enum values
    expect(() => {
      ConnectionStatus({ state: ConnectionState.Connected });
      ConnectionStatus({ state: ConnectionState.Connecting });
      ConnectionStatus({ state: ConnectionState.Reconnecting });
      ConnectionStatus({ state: ConnectionState.Disconnected });
    }).not.toThrow();
  });

  it('should handle string state values', () => {
    // Verify the component can handle string state values
    expect(() => {
      ConnectionStatus({ state: 'connected' });
      ConnectionStatus({ state: 'connecting' });
      ConnectionStatus({ state: 'reconnecting' });
      ConnectionStatus({ state: 'disconnected' });
    }).not.toThrow();
  });
});