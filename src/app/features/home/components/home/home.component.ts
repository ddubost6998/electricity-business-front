import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ChargingStation} from "../../../../entities/charging-station.entity";
import {ChargingStationService} from "../../../../services/charging-station.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    chargingStations: ChargingStation[] = [];
    isLoading: boolean = true;
    errorMessage: string | null = null;
    protected readonly location = location;

    constructor(
        private readonly chargingStationService: ChargingStationService,
        private readonly toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.getChargingStations();
    }

    getChargingStations(): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.chargingStationService.getChargingStations().subscribe({
            next: (data) => {
                this.chargingStations = data;
                this.isLoading = false;
                console.log('Bornes de recharge chargées :', this.chargingStations);
            },
            error: (error: HttpErrorResponse) => {
                this.errorMessage = error.message || 'Erreur lors du chargement des bornes de recharge.';
                this.isLoading = false;
                console.error('Erreur de chargement des bornes:', error);
                this.toastr.error(this.errorMessage, 'Erreur de chargement');
            },
        });
    }
}
