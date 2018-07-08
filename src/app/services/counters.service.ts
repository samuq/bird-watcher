import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CountersService {
  constructor(private http: HttpClient) { }
  configUrl = '/api/counters';

  getCounters():Promise<any> {
    return new Promise((resolve, reject) => {
      // Do some async stuff
      return this.http.get(this.configUrl)
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
      
    });
    
  }
}
