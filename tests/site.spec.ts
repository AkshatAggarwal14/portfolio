import { test, expect } from '@playwright/test';

test('navigation, posts, and project pages work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Hi, I'm Akshat Aggarwal");
  await expect(page.getByRole('heading', { name: 'Latest blogs' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Blogs' }).click();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Blogs' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link').filter({ hasText: 'Postgres Indexes: Why Column Order Matters' }).click();
  await expect(page.getByRole('heading', { name: 'leftmost prefix' })).toBeVisible();
  await expect(page.locator('.prose pre code .line').first()).toBeVisible();
  await expect(page.locator('.prose').getByRole('link', { name: 'Medium' })).toHaveAttribute('href', 'https://medium.com/@akshat_aggarwal/postgres-indexes-why-column-order-matters-dd1c018b2106');
  await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Projects');
  await page.getByRole('link', { name: 'RFID Attendance System' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('RFID Attendance System');
  await expect(page.getByRole('link', { name: /repository/i })).toHaveAttribute('href', 'https://github.com/AkshatAggarwal14/RFID-Attendance-system');
  await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click();
  await expect(page.getByRole('link', { name: /send an email/i })).toHaveAttribute('href', 'mailto:akshataggarwal1411@gmail.com');
  await expect(page.getByRole('link', { name: /github/i }).first()).toHaveAttribute('href', 'https://github.com/AkshatAggarwal14');
  await expect(page.getByRole('link', { name: /x \/ twitter/i }).first()).toHaveAttribute('href', 'https://x.com/akshat14agg');
  await expect(page.locator('a[href=""], a[href="#"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('dark is default and theme preference persists between pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/about/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('resume button opens live resume site', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('.nav-cta')).toHaveAttribute('href', 'https://akshataggarwal14.github.io/resume/');
  await expect(page.getByText('CSEC, NIT Hamirpur')).toBeVisible();
});

for (const width of [375, 768, 1440]) {
  test(`pages fit viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/projects/', '/projects/rfid-attendance-system/', '/blogs/', '/blogs/postgres-indexes-why-column-order-matters/', '/blogs/hello-markdown/', '/about/', '/contact/']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
}
