import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Dark Mode Support', () => {
  it('should have dark mode class in RootLayout', () => {
    // Check if the layout file exists
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    // Read the layout file content
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    // Verify dark mode class is present in html element
    expect(layoutContent).toContain('className="dark"');
  });

  it('should have Tailwind dark mode configuration', () => {
    // Check if tailwind.config.ts exists
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
    expect(fs.existsSync(tailwindConfigPath)).toBe(true);

    // Read the config file
    const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // Verify dark mode is configured
    // Tailwind CSS supports both 'class' and ['class'] syntax
    expect(configContent).toMatch(/darkMode:\s*(['"]class['"]|\[['"]class['"]\])/);
  });

  it('should have proper metadata in layout', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    // Check for metadata export
    expect(layoutContent).toContain('export const metadata');
    expect(layoutContent).toContain('title:');
    expect(layoutContent).toContain('LiveKit Test App');
    expect(layoutContent).toContain('description:');
  });

  it('should use Inter font', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    // Check for Inter font import and usage
    expect(layoutContent).toContain("import { Inter } from 'next/font/google'");
    expect(layoutContent).toContain('const inter = Inter');
    expect(layoutContent).toContain('inter.className');
  });
});