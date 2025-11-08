import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  private apiUrl = 'https://dailynewsapp-i821.onrender.com/api/User'; // ✅ your Web API base
  //private apiUrl = 'https://localhost:7011/api/User'; // ✅ your Web API base

  constructor(private http: HttpClient) { }

  // --- AUTH ---
  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, data);
  }

  // --- USERS ---
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUsers`);
  }

  // --- COMMENTS ---

  getComments(articleId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${articleId}/comments`);
  }
  
}
