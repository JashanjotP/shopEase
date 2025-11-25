import { router } from './routes';

describe('Routes', () => {
	test('should have correct route configuration', () => {
		const routes = router.routes;
		expect(routes).toBeDefined();

		// Check main paths
		const rootRoute = routes.find(r => r.path === '/');
		expect(rootRoute).toBeDefined();

		const children = rootRoute.children;
		expect(children.find(r => r.path === '/')).toBeDefined(); // Shop
		expect(children.find(r => r.path === '/women')).toBeDefined();
		expect(children.find(r => r.path === '/men')).toBeDefined();
		expect(children.find(r => r.path === '/kids')).toBeDefined();
		expect(children.find(r => r.path === '/product/:slug')).toBeDefined();
		expect(children.find(r => r.path === '/cart-items')).toBeDefined();
		expect(children.find(r => r.path === '/account-details/')).toBeDefined();
		expect(children.find(r => r.path === '/checkout')).toBeDefined();
		expect(children.find(r => r.path === '/orderConfirmed')).toBeDefined();

		// Check auth paths
		const authRoute = routes.find(r => r.path === '/v1/');
		expect(authRoute).toBeDefined();
		expect(authRoute.children.find(r => r.path === 'login')).toBeDefined();
		expect(authRoute.children.find(r => r.path === 'register')).toBeDefined();

		// Check other paths
		expect(routes.find(r => r.path === '/oauth2/callback')).toBeDefined();
		expect(routes.find(r => r.path === '/confirmPayment')).toBeDefined();
		expect(routes.find(r => r.path === '/admin/*')).toBeDefined();
	});
});
