export interface ChargingStation {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  powerKw: number;
  connectorType: string;
  isAvailable: boolean;
}
