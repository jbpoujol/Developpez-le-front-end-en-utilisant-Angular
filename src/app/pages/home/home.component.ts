import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicTransformed } from 'src/app/core/models/OlympicTransformed.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  olympics$: Observable<Olympic[] | null> = this.olympicService.getOlympics();

  transformedOlympics$ = this.olympics$
    .pipe(
      map((data) => (data ? this.transformData(data) : [])),
      takeUntil(this.destroy$)
    )
    .subscribe((data) => (this.transformedOlympics = data));

  transformedOlympics: Array<OlympicTransformed>;

  constructor(private olympicService: OlympicService, private router: Router) {}

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    this.router.navigate(['/details', data.name]);
  }

  transformData(data: Olympic[]): OlympicTransformed[] {
    return data.map((countryData) => ({
      name: countryData.country,
      value: countryData.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      ),
    }));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
