import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Playwright E2E Setup', () => {
  it('should have @playwright/test installed', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Check if @playwright/test is in devDependencies
    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies['@playwright/test']).toBeDefined();
  });

  it('should have playwright.config.ts file', () => {
    const configPath = path.join(process.cwd(), 'playwright.config.ts');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  it('should have correct playwright config structure', () => {
    const configPath = path.join(process.cwd(), 'playwright.config.ts');

    // Only check if file exists and has basic content if it exists
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');

      // Check for essential config elements
      expect(configContent).toContain("import { defineConfig");
      expect(configContent).toContain("testDir:");
      expect(configContent).toContain("baseURL:");
      expect(configContent).toContain("webServer:");
    }
  });

  it('should have e2e tests directory', () => {
    const e2eDir = path.join(process.cwd(), 'tests/e2e');
    expect(fs.existsSync(e2eDir)).toBe(true);
  });
});