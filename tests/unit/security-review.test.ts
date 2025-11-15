import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security Review', () => {
  it('should have security proxy file', () => {
    const proxyPath = path.join(process.cwd(), 'src/proxy.ts');
    expect(fs.existsSync(proxyPath)).toBe(true);
  });

  it('should have security headers configured in proxy', () => {
    const proxyPath = path.join(process.cwd(), 'src/proxy.ts');

    if (fs.existsSync(proxyPath)) {
      const proxyContent = fs.readFileSync(proxyPath, 'utf-8');

      // Check for essential security headers
      expect(proxyContent).toContain('X-Frame-Options');
      expect(proxyContent).toContain('DENY');
      expect(proxyContent).toContain('X-Content-Type-Options');
      expect(proxyContent).toContain('nosniff');
      expect(proxyContent).toContain('Referrer-Policy');
      expect(proxyContent).toContain('strict-origin-when-cross-origin');
    }
  });

  it('should export proxy function', () => {
    const proxyPath = path.join(process.cwd(), 'src/proxy.ts');

    if (fs.existsSync(proxyPath)) {
      const proxyContent = fs.readFileSync(proxyPath, 'utf-8');

      // Check for proxy function export
      expect(proxyContent).toContain('export function proxy');
      expect(proxyContent).toContain('NextRequest');
      expect(proxyContent).toContain('NextResponse');
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