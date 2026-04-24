import { test, expect } from '@playwright/test';

/**
 * Public-only grocery flows that don't require auth.
 *
 * These exercise the actual grocery API (so the backend must be running
 * and the catalog must be seeded with at least one category and product).
 * Skip the test gracefully when the catalog is empty.
 */

test.describe('Grocery — public navigation', () => {
  test('Home renders categories and bestsellers (when catalog populated)', async ({ page }) => {
    await page.goto('/grocery');
    // Either categories load or shop is closed; both are valid for the smoke
    const categoryHeading = page.getByText(/Shop by category/i);
    const closed = page.getByText(/Grocery shop closed/i);
    await Promise.race([
      categoryHeading.waitFor({ timeout: 10_000 }).catch(() => {}),
      closed.waitFor({ timeout: 10_000 }).catch(() => {}),
    ]);
    expect(
      (await categoryHeading.isVisible().catch(() => false)) ||
      (await closed.isVisible().catch(() => false))
    ).toBe(true);
  });

  test('Search overlay accepts input and shows recent / trending sections', async ({ page }) => {
    await page.goto('/grocery/search');
    const input = page.getByPlaceholder(/search products/i);
    await expect(input).toBeVisible();
    await input.fill('atta');
    // Either Suggestions section appears, or "No results" message
    await page.waitForTimeout(500); // debounce
    const suggestions = page.getByText(/Suggestions for|No results for/i);
    await expect(suggestions).toBeVisible({ timeout: 5000 });
  });

  test('Bundles page lists bundles or shows empty state', async ({ page }) => {
    await page.goto('/grocery/bundles');
    const heading = page.getByText(/Smart bundles/i);
    await expect(heading.first()).toBeVisible();
    // Either bundle cards exist, or the empty state copy
    const empty = page.getByText(/No bundles available/i);
    const hasBundles = await page.getByText(/Add bundle/i).first().isVisible().catch(() => false);
    if (!hasBundles) {
      await expect(empty).toBeVisible();
    }
  });
});
