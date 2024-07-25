import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proyect',
  templateUrl: './proyect.page.html',
  styleUrls: ['./proyect.page.scss'],
})
export class ProyectPage implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    return;
  }
}
