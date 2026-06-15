import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import {
  DummyUser,
  GenderizeResponse,
  ZippopotamResponse,
} from '../models/user.model';

export interface EnrichedUserData {
  testGender: string;
  homeState: string;
}

@Injectable({ providedIn: 'root' })
export class UserDetailService {
  private readonly http = inject(HttpClient);

  getEnrichedUserData(user: DummyUser): Observable<EnrichedUserData> {
    const gender$ = this.http
      .get<GenderizeResponse>(
        `https://api.genderize.io?name=${encodeURIComponent(user.firstName)}`
      )
      .pipe(
        map((response) => response.gender ?? 'Nedostupne'),
        catchError(() => of('Nedostupne'))
      );

    const homeState$ = this.http
      .get<ZippopotamResponse>(
        `https://api.zippopotam.us/us/${encodeURIComponent(user.address.postalCode)}`
      )
      .pipe(
        map((response) => response.places?.[0]?.state ?? 'Nedostupne'),
        catchError(() => of('Nedostupne'))
      );

    return forkJoin({
      testGender: gender$,
      homeState: homeState$,
    });
  }
}
