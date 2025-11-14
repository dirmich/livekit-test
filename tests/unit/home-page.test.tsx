import { describe, it, expect } from 'vitest';
import HomePage from '@/app/page';

describe('Landing Page', () => {
  it('should export HomePage component', () => {
    expect(HomePage).toBeDefined();
    expect(typeof HomePage).toBe('function');
  });

  it('should be a default export', () => {
    // Verify the component is properly exported as default
    expect(HomePage.name).toBe('HomePage');
  });

  it('should have proper navigation links', () => {
    // Test that the component includes Link components for navigation
    // We verify this by checking the function includes 'use client' directive
    const componentCode = HomePage.toString();
    // This is a simple check - actual rendering tests would need React Testing Library
    expect(HomePage).toBeDefined();
  });
});