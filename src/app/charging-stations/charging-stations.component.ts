import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-charging-stations',
    templateUrl: './charging-stations.component.html',
    styleUrls: ['./charging-stations.component.scss']
})
export class ChargingStationsComponent implements AfterViewInit {
    private map!: L.Map;

    ngAfterViewInit(): void {
        this.initMap();
    }

    private initMap(): void {
        this.map = L.map('map').setView([48.8566, 2.3522], 13); // exemple : Paris

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker([48.8566, 2.3522])
            .addTo(this.map)
            .bindPopup('Bonjour depuis Paris !')
            .openPopup();
    }
}
