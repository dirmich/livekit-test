/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('shadcn/ui Components', () => {
  it('should have components/ui directory', () => {
    const uiDirPath = resolve(process.cwd(), 'src/components/ui');
    expect(existsSync(uiDirPath)).toBe(true);
  });

  it('should have components.json configuration file', () => {
    const componentsJsonPath = resolve(process.cwd(), 'components.json');
    expect(existsSync(componentsJsonPath)).toBe(true);
  });

  it('should have Button component file', () => {
    const buttonPath = resolve(process.cwd(), 'src/components/ui/button.tsx');
    expect(existsSync(buttonPath)).toBe(true);
  });

  it('should have Input component file', () => {
    const inputPath = resolve(process.cwd(), 'src/components/ui/input.tsx');
    expect(existsSync(inputPath)).toBe(true);
  });

  it('should have Card component file', () => {
    const cardPath = resolve(process.cwd(), 'src/components/ui/card.tsx');
    expect(existsSync(cardPath)).toBe(true);
  });

  it('should have Badge component file', () => {
    const badgePath = resolve(process.cwd(), 'src/components/ui/badge.tsx');
    expect(existsSync(badgePath)).toBe(true);
  });

  it('should export Button component', () => {
    const buttonModule = require('@/components/ui/button');
    expect(buttonModule.Button).toBeDefined();
    // React components can be functions or objects (forwardRef)
    expect(['function', 'object']).toContain(typeof buttonModule.Button);
  });

  it('should export Input component', () => {
    const inputModule = require('@/components/ui/input');
    expect(inputModule.Input).toBeDefined();
    expect(['function', 'object']).toContain(typeof inputModule.Input);
  });

  it('should export Card components', () => {
    const cardModule = require('@/components/ui/card');
    expect(cardModule.Card).toBeDefined();
    expect(cardModule.CardHeader).toBeDefined();
    expect(cardModule.CardTitle).toBeDefined();
    expect(['function', 'object']).toContain(typeof cardModule.Card);
  });

  it('should export Badge component', () => {
    const badgeModule = require('@/components/ui/badge');
    expect(badgeModule.Badge).toBeDefined();
    expect(['function', 'object']).toContain(typeof badgeModule.Badge);
  });
});
