import {Address, AddressHttp} from "./address.entity";

export interface UserHttp {
  id: number;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  phone?: string | null;
  birthdate: string;
  verificationCode?: string | null;
  isVerified: boolean;
  address: AddressHttp;
}

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string | null;
  birthdate: Date;
  isVerified: boolean;
  address: Address;
}

export namespace User {
  export function fromHttp(userHttp: UserHttp): User {
    return {
      id: userHttp.id,
      email: userHttp.email,
      firstname: userHttp.firstname,
      lastname: userHttp.lastname,
      phone: userHttp.phone,
      birthdate: new Date(userHttp.birthdate),
      isVerified: userHttp.isVerified,
      address: Address.fromHttp(userHttp.address),
    };
  }

  export function toHttp(user: User): UserHttp {
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      birthdate: user.birthdate.toISOString(),
      isVerified: user.isVerified,
      address: Address.toHttp(user.address)
    }
  }
}
