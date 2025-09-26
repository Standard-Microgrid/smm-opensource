// Basic customer service - placeholder for future implementation
export class CustomerService {
  static async getCustomers(minigridId: string) {
    // TODO: Implement actual API call
    return [
      {
        id: '1',
        minigridId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+2348012345678',
        address: '123 Main Street, Lagos',
        meterId: '1',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}