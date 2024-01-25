import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { ParticipationTransformed } from 'src/app/core/models/ParticipationTransformed.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ViewSizeService } from 'src/app/core/services/view-size.service';
import { viewType } from 'src/app/core/types/view.type';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  countryName: string | null;
  olympicDataForCountry: Olympic | null;

  participationsTransformed: ParticipationTransformed[];

  view: viewType;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private viewSizeService: ViewSizeService
  ) {}

  ngOnInit() {
    this.countryName = this.route.snapshot.paramMap.get('country');
    if (this.countryName) {
      this.olympicService
        .getOlympicsByCountryName(this.countryName)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data) {
            this.olympicDataForCountry = data;
            this.participationsTransformed =
              this.transformParticipationsToOlympicTransformed(data);
          }
        });
    }

    this.getViewSize();
  }

  getViewSize() {
    this.viewSizeService
      .getViewSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewSize) => (this.view = viewSize));
  }

  getTotalMedals(participations?: Participation[]): number {
    if (!participations) {
      return 0;
    }
    return participations.reduce(
      (total, participation) => total + participation.medalsCount,
      0
    );
  }

  getTotalAthletes(participations?: Participation[]): number {
    if (!participations) {
      return 0;
    }
    return participations.reduce(
      (total, participation) => total + participation.athleteCount,
      0
    );
  }

  transformParticipationsToOlympicTransformed(
    olympics: Olympic
  ): ParticipationTransformed[] {
    return [
      {
        name: olympics.country,
        series: olympics.participations.map((participation) => ({
          name: participation.year.toString(),
          value: participation.medalsCount,
        })),
      },
    ];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
