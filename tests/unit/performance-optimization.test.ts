import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Performance Optimizations', () => {
  it('should have next.config.js file', () => {
    const configPath = path.join(process.cwd(), 'next.config.js');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  it('should have performance optimizations in next.config.js', () => {
    const configPath = path.join(process.cwd(), 'next.config.js');

    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');

      // Check for experimental optimizations
      expect(configContent).toContain('experimental');
      expect(configContent).toContain('optimizePackageImports');

      // Check for image optimization config
      expect(configContent).toContain('images');
    }
  });

  it('should optimize livekit-client package imports', () => {
    const configPath = path.join(process.cwd(), 'next.config.js');

    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');

      // Check for livekit-client optimization
      expect(configContent).toContain('livekit-client');
    }
  });

  it('should have Tailwind CSS configured for production optimization', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
    const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // Check that content paths are configured (for purging unused styles)
    expect(configContent).toContain('content:');
    expect(configContent).toContain('./src/');
    // Check for tsx and ts file patterns in content paths
    expect(configContent).toMatch(/\{[^}]*tsx[^}]*\}/);
    expect(configContent).toMatch(/\{[^}]*ts[^}]*\}/);
  });
});