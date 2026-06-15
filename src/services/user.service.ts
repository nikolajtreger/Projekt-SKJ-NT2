import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DummyUser, UsersResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getUsers(): Observable<DummyUser[]> {
    return this.http
      .get<UsersResponse>('https://dummyjson.com/users')
      .pipe(map((response) => response.users));
  }

  findLoginMatch(firstName: string, lastName: string): Observable<DummyUser | null> {
    const normalizedFirstName = firstName.trim().toLowerCase();
    const normalizedLastName = lastName.trim().toLowerCase();

    return this.getUsers().pipe(
      map(
        (users) =>
          users.find(
            (user) =>
              user.firstName.toLowerCase() === normalizedFirstName &&
              user.lastName.toLowerCase() === normalizedLastName
          ) ?? null
      )
    );
  }
}
