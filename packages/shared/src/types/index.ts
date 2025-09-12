// Common types for the SMM platform
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Minigrid {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Meter {
  id: string;
  minigridId: string;
  serialNumber: string;
  type: 'production' | 'consumption';
  status: 'active' | 'inactive' | 'error';
  lastReading?: number;
  lastReadingDate?: string;
}

export interface Customer {
  id: string;
  minigridId: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  meterId?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
