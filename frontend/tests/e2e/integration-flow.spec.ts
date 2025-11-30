import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Full Integration Flow', () => {

	test('should register, verify, login, browse men section, add product to cart and checkout', async ({ page }) => {
		const randomId = Math.floor(Math.random() * 10000);
		const email = `testuser${randomId}@example.com`;
		const password = 'password123';

		// 1. Register
		await page.goto('/v1/register');
		// Register form in original state only has email and password inputs visible/required
		await page.fill('input[name="email"]', email);
		await page.fill('input[name="password"]', password);
		await page.click('button:has-text("Sign Up")');

		// 2. Verify
		// Wait for verification page/modal to appear.
		await expect(page.getByText('Please enter the 6-digit verification code')).toBeVisible();

		// Fetch code from DB
		let verificationCode = '';
		for (let i = 0; i < 20; i++) {
			try {
				// Use docker exec to query the DB. 
				// Note: This assumes the test runner has access to docker.
				const stdout = execSync(`docker exec pg-db psql -U default -d shopease -t -c "SELECT verification_code FROM auth_user_details WHERE email = '${email}'"`);
				verificationCode = stdout.toString().trim();
				if (verificationCode) break;
			} catch (e: any) {
				console.log('Error fetching code, retrying...', e.message);
			}
			await page.waitForTimeout(1000);
		}

		expect(verificationCode, 'Verification code should be found').toBeTruthy();
		console.log(`Verification code for ${email}: ${verificationCode}`);

		await page.fill('input[name="code"]', verificationCode);
		await page.click('button:has-text("Verify")');

		// Wait for success message
		await expect(page.getByText('Thank you! Your email has been successfully verified')).toBeVisible();

		// 3. Login
		await page.goto('/v1/login');

		await page.fill('input[name="userName"]', email);
		await page.fill('input[name="password"]', password);
		await page.click('button:has-text("Sign In")');

		// Wait for navigation to home page
		await expect(page).toHaveURL('/');

		// 4. Go to Men's section
		await page.click('text=Men');

		// 5. Select "Black Tshirt New"
		// Click the image because the text is not a link in ProductCard.js
		await expect(page.getByText('Black Tshirt New')).toBeVisible();
		await page.click('img[alt="Black Tshirt New"]');

		// 6. Select "L" size
		await expect(page.getByText('Select Size')).toBeVisible();
		// The size filter renders divs, not buttons.
		await page.getByText('L', { exact: true }).click();

		// 7. Click "Add to Cart"
		await page.click('button:has-text("Add to cart")');

		// 8. Go to Cart and Checkout
		await page.goto('/cart-items');
		await expect(page.getByText('Black Tshirt New')).toBeVisible();
		await page.click('button:has-text("Checkout")');

		// 9. Verify we are on checkout page
		await expect(page).toHaveURL('/checkout');

		console.log('✅ Full integration flow passed');
	});
});
