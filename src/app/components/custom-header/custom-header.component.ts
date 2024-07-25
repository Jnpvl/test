import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent  implements OnInit {
  @Output() onBackRequest = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}
  
  emitBackEvent() {
    this.onBackRequest.emit();
  }

}
