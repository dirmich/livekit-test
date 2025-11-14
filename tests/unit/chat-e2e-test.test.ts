import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chat E2E Test Setup', () => {
  it('should have chat.spec.ts.playwright E2E test file', () => {
    const testPath = path.join(process.cwd(), 'tests/e2e/chat.spec.ts.playwright');
    expect(fs.existsSync(testPath)).toBe(true);
  });

  it('should have correct E2E test structure', () => {
    const testPath = path.join(process.cwd(), 'tests/e2e/chat.spec.ts.playwright');
    const testContent = fs.readFileSync(testPath, 'utf-8');

    // Check for essential test elements
    expect(testContent).toContain("import { test, expect } from '@playwright/test'");
    expect(testContent).toContain("test.describe('Chat Feature'");
    expect(testContent).toContain('should join chat room and send message');
    expect(testContent).toContain("page.goto('/chat')");
    expect(testContent).toContain('LiveKit Chat Test');
  });
});