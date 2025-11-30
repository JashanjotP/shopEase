import { test, expect } from '@playwright/test';

test('ShopEase Landing Page Smoke Test', async ({ page, request }) => {
  
  // 1. Go to the home page
  await page.goto('/');

  // 2. VISUAL CHECKS (Frontend)
  // Check if the main Logo "ShopEase" is visible in the top left
  await expect(page.getByText('ShopEase', { exact: true })).toBeVisible();

  // Check if the Hero section text "Summer Value Pack" is visible
  // This ensures your main component rendered
  await expect(page.getByText('Summer Value Pack')).toBeVisible();

  // Check if the "Shop Now" button is ready
  const shopButton = page.getByRole('button', { name: 'Shop Now' });
  await expect(shopButton).toBeVisible();
  await expect(shopButton).toBeEnabled();

  // 3. NETWORK CHECK (Backend)
  // We still want to ping the backend to ensure the container is alive.
  // Assuming you have a product endpoint like /api/products or similar.
  // If you don't have a specific health-check, requesting the root /api/ is often enough.
  const apiResponse = await request.get('/api/api/category'); 
  
  // We expect a 200 OK (Backend is up) or 401 (Backend is up but protected)
  // We just want to ensure we didn't get a 502/504 (Nginx failed to find Backend)
  expect([200, 401, 403]).toContain(apiResponse.status());
  
  console.log('✅ ShopEase Frontend and Backend are running!');
});