export interface UserHttp {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthdate: Date;
    verificationCode: string;
    isVerified: boolean;
    address: string;
}

export interface User {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthdate: Date;
    verificationCode: string;
    isVerified: boolean;
    address: string;
}

export namespace User {
    export function fromHttp(user: UserHttp): User {
        return {
            email: user.email,
            password: user.password,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            birthdate: user.birthdate,
            verificationCode: user.verificationCode,
            isVerified: user.isVerified,
            address: user.address,
        };
    }
}
