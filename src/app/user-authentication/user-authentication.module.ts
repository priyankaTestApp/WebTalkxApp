import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../Login/login.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { RegistMsgComponent } from '../RegistMsg/RegistMsg.component';
import { SecureURLComponent } from '../SecureUrl/SecureUrl.component';
import { ForgotPasswordComponent } from '../SurveyApplication/Password/ForgotPassword/ForgotPassword.component';
import { ConfirmationCodeComponent } from '../SurveyApplication/Password/ConfirmationCode/ConfirmationCode.component';
import { ResetPasswordComponent } from '../SurveyApplication/Password/ResetPassword/ResetPassword.component';







const userRoutes: Routes = [
  { path: 'Login', component: LoginComponent ,},
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login/:Userid', component: LoginComponent },
  { path: 'Login/:Userid/:Requestid', component: LoginComponent },
  { path: 'Login/:Userid/:Requestid/:Type', component: LoginComponent },
  { path: 'Signup', component: SignUpComponent },
  { path: 'Signup/:Userid', component: SignUpComponent },
  { path: 'Signup/:Userid/:Requestid', component: SignUpComponent },
  { path: 'Signup/:Userid/:Requestid/:Type', component: SignUpComponent },
  { path: 'SignupSuccess', component: RegistMsgComponent },

   { path: 'I2Breview', component: SecureURLComponent },
   { path: 'I2Breview/2r9QUFD', component: SecureURLComponent },
   { path: 'I2Breview/2r9QUFD/:id', component: SecureURLComponent},
   { path: 'I2Breview/2r9QUFD/:emailId', component: SecureURLComponent},
   { path: 'I2Breview/2r9QUFD/:id/:userId/:emailId', component: SecureURLComponent},
  
    // { path: 'I2Breview/2r9QUFD/:id', component: SecureURLComponent, pathMatch: 'full' },

  { path: 'ForgotPassword', component: ForgotPasswordComponent, pathMatch: 'full' },
  { path: 'resetPasswordCode/:id', component: ConfirmationCodeComponent, pathMatch: 'full' },
  { path: 'ResetPassword', component: ResetPasswordComponent, pathMatch: 'full' },
  { path: 'ConfirmationCode/:id', component: ConfirmationCodeComponent },

]



@NgModule({
  imports: [CommonModule,RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserAuthenticationModule {
  constructor() {
    console.log('user module before login loaded')
  }
 }
