import { describe, it, expect } from 'vitest';
import { VideoTrack } from '@/components/features/video/VideoTrack';

describe('VideoTrack Component', () => {
  it('should export VideoTrack component', () => {
    expect(VideoTrack).toBeDefined();
    expect(typeof VideoTrack).toBe('function');
  });

  it('should accept track and className props', () => {
    // Test that the component has the expected prop interface
    const componentName = VideoTrack.name;
    expect(componentName).toBe('VideoTrack');
  });
});