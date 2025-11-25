import { createOrderRequest, getStepCount } from './order-util';

describe('Order Util', () => {
	test('createOrderRequest should create a valid order request', () => {
		const cartItems = [
			{ productId: 1, variant: { id: 101 }, subTotal: 50, quantity: 2 },
			{ productId: 2, variant: { id: 102 }, subTotal: 30, quantity: 1 }
		];
		const userId = 123;
		const addressId = 456;

		const request = createOrderRequest(cartItems, userId, addressId);

		expect(request.userId).toBe(userId);
		expect(request.addressId).toBe(addressId);
		expect(request.orderDate).toBeDefined();
		expect(request.orderItemRequests).toHaveLength(2);
		expect(request.totalAmount).toBe("80.00");
		expect(request.paymentMethod).toBe("CARD");
		expect(request.currency).toBe("usd");

		expect(request.orderItemRequests[0]).toEqual({
			productId: 1,
			productVariantId: 101,
			discount: 0,
			quantity: 2
		});
	});

	test('getStepCount should return correct step counts', () => {
		expect(getStepCount['PENDING']).toBe(1);
		expect(getStepCount['IN_PROGRESS']).toBe(2);
		expect(getStepCount['SHIPPED']).toBe(3);
		expect(getStepCount['DELIVERED']).toBe(4);
	});
});
