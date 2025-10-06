import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ChargingStation} from "../entities/charging-station.entity";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ChargingStationService {
    private readonly apiUrl = environment.apiUrl + '/charging-stations';

    constructor(private readonly http: HttpClient) {
    }

    getChargingStations(): Observable<ChargingStation[]> {
        return this.http.get<ChargingStation[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
            if (error.error?.message) {
                errorMessage = error.error.message;
            }
        }
        console.error('Erreur dans ChargingStationService:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
