import { ScheduleService } from './../../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { EmailDataService } from 'src/app/services/email.service';
import { RequestFolioService } from 'src/app/services/folio.service';
import { SummaryParamsService } from 'src/app/services/sumamary-params.service';

@Component({
  selector: 'app-schedule-service',
  templateUrl: './schedule-service.page.html',
  styleUrls: ['./schedule-service.page.scss'],
})
export class ScheduleServicePage implements OnInit {
  constructor() {}

  ngOnInit() {
    return;
  }
}
