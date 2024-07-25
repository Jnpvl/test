import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { CheckAcceptedTermsGuard } from '../guards/check-accepted-terms.guard';
import { checkEmailValidationGuard } from '../guards/check-email-validation.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginPageModule),
        canActivate: [checkEmailValidationGuard],
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./register/register.module').then(
            (m) => m.RegisterPageModule
          ),
      },
      {
        path: 'otp-verification',
        loadChildren: () =>
          import('./otp-verification/otp-verification.module').then(
            (m) => m.OtpVerificationPageModule
          ),
      },
      {
        path: 'password-recovery',
        loadChildren: () =>
          import('./password-recovery/password-recovery.module').then(
            (m) => m.PasswordRecoveryPageModule
          ),
      },
      {
        path: 'terms',
        loadChildren: () =>
          import('./terms/terms.module').then((m) => m.TermsPageModule),
      },
      {
        path: 'set-new-password',
        loadChildren: () => import('./set-new-password/set-new-password.module').then( m => m.SetNewPasswordPageModule)
      },
    ],
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
