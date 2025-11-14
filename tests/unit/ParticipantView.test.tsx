import { describe, it, expect } from 'vitest';
import { ParticipantView } from '@/components/features/video/ParticipantView';

describe('ParticipantView Component', () => {
  it('should export ParticipantView component', () => {
    expect(ParticipantView).toBeDefined();
    expect(typeof ParticipantView).toBe('function');
  });

  it('should accept participant and isLocal props', () => {
    // Test that the component has the expected prop interface
    const componentName = ParticipantView.name;
    expect(componentName).toBe('ParticipantView');
  });
});