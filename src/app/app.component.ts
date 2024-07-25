import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router:Router
  ) {}

  ngOnInit(){
    this.initializeApp();
  }

  async initializeApp(){
    const token = await this.authService.getToken();
    if(token){
      this.authService.isLoggedIn = true;
      this.router.navigate(['/home']);
    }else{
      this.authService.isLoggedIn = false;
      this.router.navigate(['/auth']);
    }
  }

}
