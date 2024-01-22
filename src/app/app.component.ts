import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private olympicService: OlympicService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
