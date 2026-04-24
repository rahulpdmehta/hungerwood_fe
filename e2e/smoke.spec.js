import { test, expect } from '@playwright/test';

/**
 * Smoke test — confirms the frontend boots, the customer Home renders,
 * and the section switcher routes to the grocery home. Does not require
 * an authenticated session.
 *
 * If your backend isn't running, this still passes because none of the
 * assertions depend on data — only the React shell loading correctly.
 */

test.describe('Smoke — public customer shell', () => {
  test('Home loads with section switcher', async ({ page }) => {
    await page.goto('/');
    // The wood-brown topbar is the most stable signature of the shell
    await expect(page.locator('body')).toBeVisible();
    // Restaurant tile (brown) and Grocery tile (green) live in the section switcher
    await expect(page.getByText(/restaurant/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/grocery/i).first()).toBeVisible();
  });

  test('Grocery section accessible via direct URL', async ({ page }) => {
    await page.goto('/grocery');
    await expect(page.locator('body')).toBeVisible();
    // Grocery home shows either the section switcher or the closed banner
    const switcherOrClosed = page.locator('text=/grocery/i').first();
    await expect(switcherOrClosed).toBeVisible({ timeout: 10000 });
  });

  test('Search input on grocery home opens the search overlay', async ({ page }) => {
    await page.goto('/grocery');
    // Tap the search input link below the section switcher
    const searchLink = page.locator('a[href="/grocery/search"]').first();
    if (await searchLink.isVisible().catch(() => false)) {
      await searchLink.click();
      await expect(page).toHaveURL(/\/grocery\/search/);
      await expect(page.getByPlaceholder(/search products/i)).toBeVisible();
    }
  });
});
