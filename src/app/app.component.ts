import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { take } from 'rxjs';
import { LoaderService } from './core/services/loader.service';
import { OlympicService } from './core/services/olympic.service';
import { ViewSizeService } from './core/services/view-size.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading$ = this.loaderService.loaderState;

  constructor(
    private primengConfig: PrimeNGConfig,
    private olympicService: OlympicService,
    private viewSizeService: ViewSizeService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window) {
      this.viewSizeService.setViewSize(window.innerWidth);
    }
  }
}
