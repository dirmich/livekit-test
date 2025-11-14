/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';

describe('LiveKit SDK Installation', () => {
  const packageJsonPath = path.resolve(__dirname, '../../package.json');

  it('should have livekit-client installed', () => {
    const packageJson = require(packageJsonPath);
    expect(packageJson.dependencies['livekit-client']).toBeDefined();
  });

  it('should have livekit-server-sdk installed', () => {
    const packageJson = require(packageJsonPath);
    expect(packageJson.dependencies['livekit-server-sdk']).toBeDefined();
  });

  it('should be able to import Room from livekit-client', async () => {
    const { Room } = await import('livekit-client');
    expect(Room).toBeDefined();
    expect(typeof Room).toBe('function');
  });

  it('should be able to import AccessToken from livekit-server-sdk', async () => {
    const { AccessToken } = await import('livekit-server-sdk');
    expect(AccessToken).toBeDefined();
    expect(typeof AccessToken).toBe('function');
  });

  it('should have types for livekit-client', () => {
    const nodeModulesPath = path.resolve(__dirname, '../../node_modules/livekit-client');
    expect(fs.existsSync(nodeModulesPath)).toBe(true);
  });

  it('should have types for livekit-server-sdk', () => {
    const nodeModulesPath = path.resolve(__dirname, '../../node_modules/livekit-server-sdk');
    expect(fs.existsSync(nodeModulesPath)).toBe(true);
  });
});
