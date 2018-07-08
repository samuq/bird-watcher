import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class CountersService {
  constructor(private http: HttpClient) { }
  configUrl = '/counters.json';

  getCounters() {
    return this.http.get(this.configUrl)
    .subscribe((status) => console.log(`status = ${status}`));;
  }
}
