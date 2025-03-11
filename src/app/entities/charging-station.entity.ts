export interface ChargingStationHttp {
  id: number;
  name: string;
  hourlyRate: number;
  power: number;
  instruction?: string | null;
  picture?: string | null;
  video?: string | null;
  isAvailable: boolean;
  locationId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChargingStation {
  id: number;
  name: string;
  hourlyRate: number;
  power: number;
  instruction?: string | null;
  picture?: string | null;
  video?: string | null;
  isAvailable: boolean;
  locationId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export namespace ChargingStation {
  export function fromHttp(chargingStationHttp: ChargingStationHttp): ChargingStation {
    return {
      id: chargingStationHttp.id,
      name: chargingStationHttp.name,
      hourlyRate: chargingStationHttp.hourlyRate,
      power: chargingStationHttp.power,
      instruction: chargingStationHttp.instruction,
      picture: chargingStationHttp.picture,
      video: chargingStationHttp.video,
      isAvailable: chargingStationHttp.isAvailable,
      locationId: chargingStationHttp.locationId,
      userId: chargingStationHttp.userId,
      createdAt: new Date(chargingStationHttp.createdAt),
      updatedAt: new Date(chargingStationHttp.updatedAt)
    };
  }

  export function toHttp(chargingStation: ChargingStation): ChargingStationHttp {
    return {
      id: chargingStation.id,
      name: chargingStation.name,
      hourlyRate: chargingStation.hourlyRate,
      power: chargingStation.power,
      instruction: chargingStation.instruction,
      picture: chargingStation.picture,
      video: chargingStation.video,
      isAvailable: chargingStation.isAvailable,
      locationId: chargingStation.locationId,
      userId: chargingStation.userId,
      createdAt: chargingStation.createdAt.toISOString(),
      updatedAt: chargingStation.updatedAt.toISOString()
    }
  }
}
