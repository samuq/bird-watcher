import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {
  @Input()
  counter;
  @Output() addToCounter = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  add(species:string){
    this.addToCounter.emit(species);
  }
}
