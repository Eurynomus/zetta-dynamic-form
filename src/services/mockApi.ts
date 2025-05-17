export async function mockApiCall(input: Record<string, string>): Promise<{ [key: string]: any }> {
  console.log('API called with:', input);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (input.userId && input.token) {
        switch (input.userId) {
          case '1':
            return resolve({
              firstName: 'Martin',
              lastName: 'Cholashki',
              email: 'martin@gmail.com',
              role: 'Admin',
            });
          case '2':
            return resolve({
              firstName: 'Ivan',
              lastName: 'Ivanov',
              email: 'ivan@gmail.com',
              role: 'Editor',
            });
          case '3':
            return resolve({
              firstName: 'Peter',
              lastName: 'Petrov',
              email: 'peter@gmail.com',
              role: 'User',
            });
          default:
            return reject(new Error(`No user found for User ID - ${input.userId}`));
        }
      }

      if (input.orderId) {
        switch (input.orderId) {
          case '1':
            return resolve({
              product: 'Laptop',
              quantity: '2',
              status: 'Shipped'
            });
          case '2':
            return resolve({
              product: 'TV',
              quantity: '1',
              status: 'Processing'
            });
          case '3':
            return resolve({
              product: 'Phone',
              quantity: '4',
              status: 'Rejected'
            });
          default:
            return reject(new Error(`No order found for Order ID - ${input.orderId}`));
        }
      }

      return reject(new Error('Unknown API input'));
    }, 1000);
  });
}