import {Address, AddressHttp} from './address.entity';

export interface LocationHttp {
  id: number;
  name: string;
  address: AddressHttp;
  latitude: number;
  longitude: number;
  userId: number;
}

export interface Location {
  id: number;
  name: string;
  address: Address;
  latitude: number;
  longitude: number;
  userId: number;
}

export namespace Location {
  export function fromHttp(locationHttp: LocationHttp): Location {
    return {
      id: locationHttp.id,
      name: locationHttp.name,
      address: Address.fromHttp(locationHttp.address),
      latitude: locationHttp.latitude,
      longitude: locationHttp.longitude,
      userId: locationHttp.userId,
    };
  }

  export function toHttp(location: Location): LocationHttp {
    return {
      id: location.id,
      name: location.name,
      address: Address.toHttp(location.address),
      latitude: location.latitude,
      longitude: location.longitude,
      userId: location.userId
    }
  }
}
