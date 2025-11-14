/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('Project Structure', () => {
  it('should have package.json with Next.js configuration', () => {
    const packageJsonPath = resolve(process.cwd(), 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);

    if (existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies.next).toBeDefined();
      expect(packageJson.dependencies.react).toBeDefined();
      expect(packageJson.dependencies['react-dom']).toBeDefined();
    }
  });

  it('should have TypeScript configuration', () => {
    const tsconfigPath = resolve(process.cwd(), 'tsconfig.json');
    expect(existsSync(tsconfigPath)).toBe(true);
  });

  it('should have Tailwind CSS configuration', () => {
    const tailwindConfigPath = resolve(process.cwd(), 'tailwind.config.ts');
    expect(existsSync(tailwindConfigPath)).toBe(true);
  });

  it('should have Next.js app directory structure', () => {
    const appDirPath = resolve(process.cwd(), 'src/app');
    expect(existsSync(appDirPath)).toBe(true);
  });

  it('should have dev script in package.json', () => {
    const packageJsonPath = resolve(process.cwd(), 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toBeDefined();
    }
  });
});
