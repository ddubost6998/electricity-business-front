export interface ReservationHttp {
  id: number;
  userId: number;
  chargingStationId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  userId: number;
  chargingStationId: number;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export namespace Reservation {
  export function fromHttp(reservationHttp: ReservationHttp): Reservation {
    return {
      id: reservationHttp.id,
      userId: reservationHttp.userId,
      chargingStationId: reservationHttp.chargingStationId,
      startTime: new Date(reservationHttp.startTime),
      endTime: new Date(reservationHttp.endTime),
      totalPrice: reservationHttp.totalPrice,
      status: reservationHttp.status as ReservationStatus,
      createdAt: new Date(reservationHttp.createdAt),
      updatedAt: new Date(reservationHttp.updatedAt)
    };
  }

  export function toHttp(reservation: Reservation): ReservationHttp {
    return {
      id: reservation.id,
      userId: reservation.userId,
      chargingStationId: reservation.chargingStationId,
      startTime: reservation.startTime.toISOString(),
      endTime: reservation.endTime.toISOString(),
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString()
    };
  }
}
