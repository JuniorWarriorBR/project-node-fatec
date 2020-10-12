import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/models/job/job';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showDashboard = false;
  job = {} as Job;
  jobs: Job[];

  constructor(
    private jobService: JobService
  ) { }

  ngOnInit() {
    this.getJob();
  }

  getJob() {
    this.jobService.getJob().subscribe((jobs: Job[]) => {
      this.jobs = jobs['jobs'];
      this.jobs.length > 0 ? this.showDashboard = true : this.showDashboard = false
    });
  }

}
