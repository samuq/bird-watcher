import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }
  getReport():Promise<any> {
    return new Promise((resolve, reject) => {
      // Do some async stuff
      return this.http.get('/api/report')
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
      
    });
    
  }
}
