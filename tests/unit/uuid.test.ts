import { describe, it, expect } from 'vitest';
import { generateUUID } from '@/lib/utils/uuid';

describe('UUID Generator', () => {
  it('should generate valid UUID format', () => {
    const uuid = generateUUID();

    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate UUIDs of correct length', () => {
    const uuid = generateUUID();

    expect(uuid.length).toBe(36); // 32 chars + 4 hyphens
  });

  it('should work without crypto.randomUUID', () => {
    // Simulate browser without crypto.randomUUID
    const originalRandomUUID = crypto.randomUUID;
    // @ts-ignore - testing fallback
    delete crypto.randomUUID;

    const uuid = generateUUID();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);

    // Restore
    crypto.randomUUID = originalRandomUUID;
  });
});
