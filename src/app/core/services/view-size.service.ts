import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { viewType } from '../types/view.type';

@Injectable({
  providedIn: 'root',
})
export class ViewSizeService {
  private viewSize = new BehaviorSubject<viewType>(
    this.calculateViewSize(window.innerWidth)
  );

  private getBreakpointCategory(width: number): string {
    if (width >= 1400) return 'xxl';
    if (width >= 1200) return 'xl';
    if (width >= 992) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 576) return 'sm';
    return 'xs';
  }

  private calculateViewSize(width: number): viewType {
    const category = this.getBreakpointCategory(width);

    switch (category) {
      case 'xxl':
        return [1400, 900];
      case 'xl':
        return [1200, 800];
      case 'lg':
        return [992, 744];
      case 'md':
        return [768, 576];
      case 'sm':
        return [576, 432];
      default:
        return [360, 270];
    }
  }

  setViewSize(size: number) {
    this.viewSize.next(this.calculateViewSize(size));
  }

  getViewSize() {
    return this.viewSize.asObservable();
  }
}
