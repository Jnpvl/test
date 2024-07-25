import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Activity } from 'src/app/interfaces/activity.interface';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {
  @Input() lastActivity: boolean = false;
  @Input() activity: Activity | null = null;
  @Output() activitySelected = new EventEmitter<Activity>();
  @Input() photoUrl: string | null = null;

  constructor() { }

  ngOnInit() { }

  sendActivity(activity: Activity) {
    if (activity) {
      this.activitySelected.emit(activity);
    }
  }
}
