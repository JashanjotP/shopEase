import { test, expect } from '@playwright/test';

test.describe('Shop Flow', () => {

	test.beforeEach(async ({ page }) => {
		// Mock the products API response
		await page.route('**/api/products/category/**', async route => {
			const json = [
				{
					id: 1,
					name: 'Test Product',
					price: 100,
					thumbnail: 'https://via.placeholder.com/150',
					slug: 'test-product',
					category_id: 1,
					variants: [
						{ color: 'Red', size: 'M', stockQuantity: 10 }
					]
				}
			];
			await route.fulfill({ json });
		});

		// Mock the single product API response (if used by loader)
		// The loader calls getProductBySlug which uses /api/products?slug=...
		await page.route('**/api/products?slug=test-product', async route => {
			const json = [{
				id: 1,
				name: 'Test Product',
				price: 100,
				description: 'A great product',
				thumbnail: 'https://via.placeholder.com/150',
				slug: 'test-product',
				categoryId: 1,
				variants: [
					{ color: 'Red', size: 'M', stockQuantity: 10 }
				],
				productResources: []
			}];
			await route.fulfill({ json });
		});

		await page.goto('/');

		// Navigate to a category (e.g., Women)
		await page.click('text=Women');

		// Check if product is visible
		await expect(page.getByText('Test Product')).toBeVisible();

		// Click on the product
		await page.click('text=Test Product');

		// Check product details page
		await expect(page.getByText('A great product')).toBeVisible();

		// Select size (assuming generic selector for now, might need adjustment)
		// The SizeFilter component likely renders buttons.
		await page.getByText('M', { exact: true }).click();

		// Add to cart
		await page.click('button:has-text("Add to cart")');

		// Verify cart update (optional, depends on UI feedback)
		// Maybe check cart icon badge or navigate to cart
		await page.goto('/cart-items');
		await expect(page.getByText('Test Product')).toBeVisible();
	});
});
