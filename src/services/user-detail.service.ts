import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import {
  Actor,
  GenderAnalysis,
  RegionResponse,
} from '../models/user.model';

export interface DetailedProfile {
  detectedGender: string;
  residenceState: string;
}

@Injectable({ providedIn: 'root' })
export class UserDetailService {
  private http = inject(HttpClient);

  getDetailedProfile(actor: Actor): Observable<DetailedProfile> {
    const gender$ = this.http
      .get<GenderAnalysis>(
        `https://api.genderize.io?name=${encodeURIComponent(actor.first)}`
      )
      .pipe(
        map((res) => res.gender ?? 'N/A'),
        catchError(() => of('N/A'))
      );

    const state$ = this.http
      .get<RegionResponse>(
        `https://api.zippopotam.us/us/${encodeURIComponent(actor.location.zip)}`
      )
      .pipe(
        map((res) => res.places?.[0]?.state ?? 'N/A'),
        catchError(() => of('N/A'))
      );

    return forkJoin({
      detectedGender: gender$,
      residenceState: state$,
    });
  }
}
