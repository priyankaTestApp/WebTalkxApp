import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

 import { LoginComponent } from './Login/login.component';
import { SurveyApplicationComponent } from './SurveyApplication/SurveyApplication.component';
import { SurveyStartComponent } from './SurveyApplication/survey-start/survey-start.component';
import { SurveyRecordComponent } from './SurveyApplication/survey-record/survey-record.component';
import { SurveyCompleteComponent } from './SurveyApplication/survey-complete/survey-complete.component';
import { IntroVideoComponent } from './SurveyApplication/intro-video/intro-video.component';

import { DashboardComponent } from './SurveyApplication/Dashboard/Dashboard.component';

import { ConfirmationCodeComponent } from './SurveyApplication/Password/ConfirmationCode/ConfirmationCode.component';
 import { ForgotPasswordComponent } from './SurveyApplication/Password/ForgotPassword/ForgotPassword.component';

 import { RegistMsgComponent } from './RegistMsg/RegistMsg.component';
 import { SecureURLComponent } from './SecureUrl/SecureUrl.component';
 import { ResetPasswordComponent } from './SurveyApplication/Password/ResetPassword/ResetPassword.component';

 import { SignUpComponent } from './sign-up/sign-up.component';

import { AuthGuard } from './authentication/auth.guard';

import { Test1Component } from './test1/test1.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  
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
  { path: 'ForgotPassword', component: ForgotPasswordComponent, pathMatch: 'full' },
  { path: 'resetPasswordCode/:id', component: ConfirmationCodeComponent, pathMatch: 'full' },
  { path: 'ResetPassword', component: ResetPasswordComponent, pathMatch: 'full' },
  { path: 'ConfirmationCode/:id', component: ConfirmationCodeComponent },
 
  { path: 'I2BApplication', loadChildren: () => import(`./survey-apps/survey-apps.module`).then(m => m.SurveyAppsModule),canActivate:[AuthGuard] },
  

  //Page not found routes
  { path: '404', component: PageNotFoundComponent },
  { path: '**',pathMatch:'full', redirectTo:'/404'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
