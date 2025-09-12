// Basic minigrid service - placeholder for future implementation
export class MinigridService {
  static async getMinigrids(userId: string) {
    // TODO: Implement actual API call
    return [
      {
        id: '1',
        name: 'Sample Minigrid',
        location: 'Lagos, Nigeria',
        capacity: 100,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}