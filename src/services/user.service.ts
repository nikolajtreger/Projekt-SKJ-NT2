import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Actor, ActorsData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class PrincipalDataService {
  private http = inject(HttpClient);

  listAllActors(): Observable<Actor[]> {
    return this.http
      .get<ActorsData>('https://dummyjson.com/users')
      .pipe(map((res) => res.users));
  }

  verifyCredentials(fname: string, lname: string): Observable<Actor | null> {
    const fnameLower = fname.trim().toLowerCase();
    const lnameLower = lname.trim().toLowerCase();

    return this.listAllActors().pipe(
      map(
        (items) =>
          items.find(
            (item) =>
              item.first.toLowerCase() === fnameLower &&
              item.last.toLowerCase() === lnameLower
          ) ?? null
      )
    );
  }
}
