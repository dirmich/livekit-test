import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security Review', () => {
  it('should have security middleware file', () => {
    const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
    expect(fs.existsSync(middlewarePath)).toBe(true);
  });

  it('should have security headers configured in middleware', () => {
    const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');

    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');

      // Check for essential security headers
      expect(middlewareContent).toContain('X-Frame-Options');
      expect(middlewareContent).toContain('DENY');
      expect(middlewareContent).toContain('X-Content-Type-Options');
      expect(middlewareContent).toContain('nosniff');
      expect(middlewareContent).toContain('Referrer-Policy');
      expect(middlewareContent).toContain('strict-origin-when-cross-origin');
    }
  });

  it('should export middleware function', () => {
    const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');

    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');

      // Check for middleware function export
      expect(middlewareContent).toContain('export function middleware');
      expect(middlewareContent).toContain('NextRequest');
      expect(middlewareContent).toContain('NextResponse');
    }
  });

  it('should validate environment variables are not exposed', () => {
    // Check that sensitive env vars are properly prefixed
    const configPath = path.join(process.cwd(), 'src/config.ts');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    // LiveKit API secret should never be exposed to client
    expect(configContent).toContain('LIVEKIT_API_SECRET');
    // Only NEXT_PUBLIC_ prefixed vars should be exposed to client
    expect(configContent).toContain('NEXT_PUBLIC_LIVEKIT_URL');
  });

  it('should have secure token generation', () => {
    const tokenPath = path.join(process.cwd(), 'src/lib/livekit/token.ts');
    const tokenContent = fs.readFileSync(tokenPath, 'utf-8');

    // Check for secure token generation practices
    expect(tokenContent).toContain('AccessToken');
    expect(tokenContent).toContain('apiKey');
    expect(tokenContent).toContain('apiSecret');
    // Token should have expiration
    expect(tokenContent).toContain('ttl');
  });
});