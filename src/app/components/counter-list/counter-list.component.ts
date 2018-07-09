import { Component, OnInit } from '@angular/core';
import { CountersService } from '../../services/counters.service';
@Component({
  selector: 'app-counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.css']
})
export class CounterListComponent implements OnInit {

  constructor(private countersService: CountersService) { }
  counters:any[];
  ngOnInit() {
    this.countersService.getCounters().then((res)=>{
      console.log(res);
      this.counters = res.data;
    }).catch((err)=>{
      console.log(err);
    });
  }
  model = {'species': ''};

  submitted = false;
  add(species:string){
    this.countersService.add(species).then((res)=>{
      console.log(res);
      if(res.data){
        this.counters = res.data;
      }
    }).catch((err)=>{
      console.log(err);
    });
  }
  onSubmit() { 
    this.submitted = true; 
    this.countersService.addCounters(this.model.species).then((res)=>{
      console.log(res);
      if(res.data){
        this.counters = res.data;
      }
    }).catch((err)=>{
      console.log(err);
    });
  }
}
