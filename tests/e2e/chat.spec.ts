import { test, expect } from '@playwright/test';

test.describe('Chat Feature', () => {
  test('should join chat room and send message', async ({ page }) => {
    await page.goto('/chat');

    await expect(page.getByRole('heading', { name: 'LiveKit Chat Test' })).toBeVisible();

    await page.fill('input[placeholder="Room Name"]', 'test-room');
    await page.fill('input[placeholder="Your Name"]', 'Test User');
    await page.click('button:has-text("Join Room")');

    await expect(page.getByText('Room: test-room')).toBeVisible();

    await page.fill('input[placeholder="Type a message..."]', 'Hello World');
    await page.click('button:has-text("Send")');

    await expect(page.getByText('Hello World')).toBeVisible();
  });
});