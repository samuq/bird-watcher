import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { ReversePipe } from '../..pipes/flipOrder';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private reportsService: ReportsService) { }
  report:any[];
  ngOnInit() {
    this.reportsService.getReport().then((res)=>{
      console.log(res);
      this.report = res.data;
    }).catch((err)=>{
      console.log(err);
    });
  }

}
