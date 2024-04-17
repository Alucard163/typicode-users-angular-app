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

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  public deleteUser<T>(id: number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${id}`);
  }

  public postUser<T>(data: T ): Observable<T>{
    return this.http.post<T>(`${this.apiUrl}`, JSON.stringify(data));
  }

  public putUser<T>(id: number, data: T): Observable<T>{
    return this.http.put<T>(`${this.apiUrl}/${id}`, JSON.stringify(data));
  }
}
