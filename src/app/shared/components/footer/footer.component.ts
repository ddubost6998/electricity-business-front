import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [
        RouterLink,
        NgOptimizedImage
    ],
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    currentYear: number;

    constructor() {

    }

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}
