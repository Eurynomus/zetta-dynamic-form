import { mockApiCall } from "../../services/mockApi";

describe('mockApiCall', () => {
  it('returns user data for userId 1', async () => {
    const result = await mockApiCall({ userId: '1', token: 'validToken' });
    expect(result).toEqual({
      firstName: 'Martin',
      lastName: 'Cholashki',
      email: 'martin@gmail.com',
      role: 'Admin',
    });
  });

  it('returns order data for orderId 2', async () => {
    const result = await mockApiCall({ orderId: '2' });
    expect(result).toEqual({
      product: 'TV',
      quantity: '1',
      status: 'Processing',
    });
  });

  it('throws error for unknown userId', async () => {
    await expect(mockApiCall({ userId: '999', token: 'validToken' })).rejects.toThrow(
      'No user found for User ID - 999'
    );
  });

  it('throws error for unknown orderId', async () => {
    await expect(mockApiCall({ orderId: '999' })).rejects.toThrow(
      'No order found for Order ID - 999'
    );
  });

  it('throws error for missing required fields', async () => {
    await expect(mockApiCall({})).rejects.toThrow('Unknown API input');
  });
});
