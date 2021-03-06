import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CounterComponent } from './components/counter/counter.component';
import { CounterListComponent } from './components/counter-list/counter-list.component';
import { ReportComponent } from './components/report/report.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReversePipe } from './pipes/reverse.pipe';
const appRoutes: Routes = [
  { path: 'report', component: ReportComponent },
  {
    path: 'counters',
    component: CounterListComponent
  },
  { path: '',
    redirectTo: '/counters',
    pathMatch: 'full'
  }
]
@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    CounterListComponent,
    ReportComponent,
    ReversePipe
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
