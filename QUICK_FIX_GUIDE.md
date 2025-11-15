# Quick Fix Guide - Get to 100% Passing Tests

**Current Status**: 84/101 tests passing (83.2%)
**Target**: 101/101 tests passing (100%)
**Estimated Time**: 2-4 hours

---

## Fix #1: Environment Variables (Fixes 11 tests)

### Problem
Tests fail with: `api-key and api-secret must be set`

### Files Affected
- config.test.ts (4 failures)
- token.test.ts (5 failures)
- token-api.test.ts (2 failures)

### Solution A: Create Test Environment File

```bash
# Create .env.test in project root
cat > .env.test << 'EOF'
LIVEKIT_URL=wss://test-livekit-server.com
LIVEKIT_API_KEY=test-api-key
LIVEKIT_API_SECRET=test-api-secret
EOF
```

Then update `tests/setup.ts`:
```typescript
import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(process.cwd(), '.env.test') });
```

### Solution B: Mock LiveKit SDK (Recommended)

Create `tests/mocks/livekit.ts`:
```typescript
import { vi } from 'vitest';

// Mock AccessToken class
export class MockAccessToken {
  constructor(
    public apiKey: string,
    public apiSecret: string,
    public options?: any
  ) {}

  async toJwt(): Promise<string> {
    return 'mock-jwt-token';
  }

  addGrant(grant: any) {
    return this;
  }
}

// Mock module
vi.mock('livekit-server-sdk', () => ({
  AccessToken: MockAccessToken,
}));
```

Update `vitest.config.ts`:
```typescript
test: {
  globals: true,
  environment: 'happy-dom',
  setupFiles: ['./tests/setup.ts', './tests/mocks/livekit.ts'],
  // ... rest of config
}
```

**Expected Result**: 11 tests should now pass
**Verification**: `npm test -- tests/unit/config.test.ts tests/unit/token.test.ts tests/unit/token-api.test.ts`

---

## Fix #2: shadcn-ui Module Resolution (Fixes 4 tests)

### Problem
`Error: Cannot find module '@/components/ui/button'`

### Files Affected
- shadcn-ui.test.tsx (4 failures)

### Root Cause Analysis

Check if components actually export correctly:
```bash
# Verify exports exist
cat src/components/ui/button.tsx | grep "export"
cat src/components/ui/input.tsx | grep "export"
cat src/components/ui/card.tsx | grep "export"
cat src/components/ui/badge.tsx | grep "export"
```

### Solution A: Fix Vitest Path Mapping

Ensure `vitest.config.ts` has correct alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

### Solution B: Use Dynamic Imports in Tests

Update `tests/unit/shadcn-ui.test.tsx`:
```typescript
it('should export Button component', async () => {
  const buttonModule = await import('@/components/ui/button');
  expect(buttonModule.Button).toBeDefined();
  expect(['function', 'object']).toContain(typeof buttonModule.Button);
});
```

### Solution C: Check Component Exports

If components don't have named exports, update them:
```typescript
// button.tsx
export { Button };  // Add if missing

// OR use default export in tests
const { default: Button } = await import('@/components/ui/button');
```

**Expected Result**: 4 tests should now pass
**Verification**: `npm test -- tests/unit/shadcn-ui.test.tsx`

---

## Fix #3: Playwright Configuration (Fixes 1 test)

### Problem
`playwright.config.ts file does not exist`

### Files Affected
- playwright-setup.test.ts (1 failure)

### Solution

```bash
# Create Playwright configuration
npx playwright install
npx playwright init

# This creates playwright.config.ts automatically
```

Or manually create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Expected Result**: 1 test should now pass
**Verification**: `npm test -- tests/unit/playwright-setup.test.ts`

---

## Verification Checklist

After implementing all fixes:

```bash
# 1. Run all tests
npm test

# Expected output:
# Test Files  27 passed (27)
# Tests       101 passed (101)

# 2. Verify no failures
npm test -- --reporter=verbose | grep "FAIL"
# Should return nothing

# 3. Check skipped tests
npm test -- --reporter=verbose | grep "skipped"
# Should show: 1 skipped (linting.test.ts - intentional)

# 4. Generate coverage report
npm test -- --coverage

# 5. Verify linting
npm run lint
# Should show only warnings, no errors
```

---

## Quick Command Reference

```bash
# Run failing tests only
npm test -- tests/unit/config.test.ts
npm test -- tests/unit/token.test.ts
npm test -- tests/unit/token-api.test.ts
npm test -- tests/unit/shadcn-ui.test.tsx
npm test -- tests/unit/playwright-setup.test.ts

# Run all tests
npm test

# Run with watch mode for development
npm test -- --watch

# Run specific test by name
npm test -- -t "should generate valid token"

# Run tests and show full output
npm test -- --reporter=verbose

# Check TypeScript compilation
npx tsc --noEmit
```

---

## Common Issues & Solutions

### Issue: Tests still fail after creating .env.test

**Check**: Is the file being loaded?
```typescript
// Add to tests/setup.ts
console.log('LIVEKIT_URL:', process.env.LIVEKIT_URL);
```

**Solution**: Ensure dotenv is installed and configured correctly

### Issue: Module resolution still fails

**Check**: TypeScript compilation
```bash
npx tsc --noEmit
```

**Solution**: Fix any TypeScript errors first, then re-run tests

### Issue: Playwright config exists but test still fails

**Check**: File location
```bash
ls -la playwright.config.ts
```

**Solution**: Ensure it's in the project root, not in a subdirectory

---

## Expected Final Result

```
✅ Test Files  27 passed (27)
✅ Tests       100 passed | 1 skipped (101 total)
✅ Duration    ~10-15 seconds
⚠️ Skipped    1 test (linting.test.ts - intentional)
```

---

## Next Steps After 100% Pass

1. **Enable Coverage Reporting**
   ```bash
   npm test -- --coverage
   ```

2. **Review Coverage Report**
   ```bash
   open coverage/index.html
   ```

3. **Activate E2E Tests**
   ```bash
   mv tests/e2e/chat.spec.ts.playwright tests/e2e/chat.spec.ts
   npx playwright test
   ```

4. **Set Coverage Thresholds**
   - Update vitest.config.ts with 80% targets
   - Enforce in CI/CD pipeline

5. **Add Missing Tests**
   - AudioTrack component
   - middleware.ts
   - utils.ts

---

**Estimated Time to 100%**: 2-4 hours
**Difficulty**: Medium
**Impact**: High (enables coverage reporting and CI/CD)

**Questions?** See TEST_ANALYSIS_REPORT.md for detailed explanations
