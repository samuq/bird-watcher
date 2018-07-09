import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  add(species: string):Promise<any>{
    return new Promise((resolve, reject) => {
      // Do some async stuff
      return this.http.get(this.configUrl+"/"+species)
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
      
    });
  }
  addCounters(species: string):Promise<any> {
    const data = {'species': species}
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise((resolve, reject) => {
      // Do some async stuff
      return this.http.post(this.configUrl, data, {headers: headers})
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
      
    });
  }
}
