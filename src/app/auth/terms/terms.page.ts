import { Component, OnInit } from '@angular/core';
import { TermsService } from 'src/app/services/terms.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  constructor(private termsService: TermsService) {}

  ngOnInit() {
    return;
  }

  acceptTerms() {
    this.termsService.setTermsAccepted();
    window.location.href = '/auth/login';
  }
}
