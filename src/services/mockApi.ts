export async function mockApiCall(input: Record<string, string>): Promise<{ [key: string]: any }> {
  console.log('API called with:', input);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (input.userId && input.token) {
        return resolve({
          firstName: 'Martin',
          lastName: 'Cholashki',
          email: 'example@gmail.com'
        });
      }

      if (input.orderId) {
        return resolve({
          product: 'Laptop',
          quantity: '2',
          status: 'Shipped'
        });
      }

      return reject(new Error('Unknown API input'));
    }, 1000);
  });
}