// Basic meter service - placeholder for future implementation
export class MeterService {
  static async getMeters(minigridId: string) {
    // TODO: Implement actual API call
    return [
      {
        id: '1',
        minigridId,
        serialNumber: 'MTR001',
        type: 'production',
        status: 'active',
        lastReading: 1500,
        lastReadingDate: new Date().toISOString(),
      }
    ];
  }
}