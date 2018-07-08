import { Component, OnInit } from '@angular/core';
import { CountersService } from '../../services/counters.service';
@Component({
  selector: 'app-counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.css']
})
export class CounterListComponent implements OnInit {

  constructor(private countersService: CountersService) { }

  ngOnInit() {
    this.countersService.getCounters().then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    });
  }

}
