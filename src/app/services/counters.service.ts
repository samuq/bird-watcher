import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountersService {

  constructor(private http: HttpClient) { }
  configUrl = '/counters.json';

  getCounters() {
    return this.http.get(this.configUrl);
  }
}