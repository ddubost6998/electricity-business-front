export interface AddressHttp {
  id: number;
  street: string;
  city: string;
  zipcode: string;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  zipcode: string;
}

export namespace Address {
  export function fromHttp(addressHttp: AddressHttp): Address {
    return {
      id: addressHttp.id,
      street: addressHttp.street,
      city: addressHttp.city,
      zipcode: addressHttp.zipcode,
    };
  }

  export function toHttp(address: Address): AddressHttp {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      zipcode: address.zipcode,
    };
  }
}
