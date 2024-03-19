import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { User } from "../interfaces/user.interface";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private  http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
