import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
//import { DataTablesModule } from '@angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideojsRecordComponent } from './videojs-record/videojs-record.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//import { HttpModule } from '@angular/http';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ArchwizardModule } from 'angular-archwizard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule, Routes } from '@angular/router';
//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { AutocompleteLibModule } from 'angular-ng-autocomplete';
//import { DataTablesModule } from 'angular-datatables';

import { SurveyApplicationComponent } from './SurveyApplication/SurveyApplication.component';
import { SurveyStartComponent } from './SurveyApplication/survey-start/survey-start.component';
import { LoginComponent } from './Login/login.component';
import { SurveyRecordComponent } from './SurveyApplication/survey-record/survey-record.component';
import { SurveyCompleteComponent } from './SurveyApplication/survey-complete/survey-complete.component';
import { IntroVideoComponent } from './SurveyApplication/intro-video/intro-video.component';

import { DashboardComponent } from './SurveyApplication/Dashboard/Dashboard.component';
import { RecordingRequestComponent } from './SurveyApplication/Ask/RecordingRequest/RecordingRequest.component';
import { RecordingComponent } from './SurveyApplication/Record/RecordingComponent/RecordingComponent.component';
import { RequestedByMeComponent } from './SurveyApplication/Record/RequestedByMe/RequestedByMe.component';
import { RecordingsCatalogIRequestedComponent } from './SurveyApplication/Catalog/RecordingsCatalogIRequested/RecordingsCatalogIRequested.component';
import { InboxComponent } from './SurveyApplication/Inbox/Inbox.component';
import { RecordingReviewComponent } from './SurveyApplication/RecordingReview/RecordingReview';
import { ChangePasswordComponent } from './SurveyApplication/Password/ChangePassword/ChangePassword.component';

import { RequestsFromMeComponent } from './SurveyApplication/Record/RequestsFromMe/RequestsFromMe.component';
import { RecordingsCatalogIDidComponent } from './SurveyApplication/Catalog/RecordingsCatalogIDid/RecordingsCatalogIDid.component';
import { RecordingsCatalogForMyReviewComponent } from './SurveyApplication/Catalog/RecordingsCatalogForMyReview/RecordingsCatalogForMyReview.component';
import { MyQuestionsComponent } from './SurveyApplication/Ask/MyQuestions/MyQuestions.component';

import { RegistMsgComponent } from './RegistMsg/RegistMsg.component';
import { SecureURLComponent } from './SecureUrl/SecureUrl.component';
import { TeamMembersComponent } from './SurveyApplication/TeamMembers/TeamMembers.component';

import { SavedRequestsComponent } from './SurveyApplication/Ask/SavedRequests/SavedRequests.component';
import { EditProfileComponent } from './SurveyApplication/EditProfile/EditProfile.component';

import { ConfirmationCodeComponent } from './SurveyApplication/Password/ConfirmationCode/ConfirmationCode.component';
import { ForgotPasswordComponent } from './SurveyApplication/Password/ForgotPassword/ForgotPassword.component';
import { ResetPasswordComponent } from './SurveyApplication/Password/ResetPassword/ResetPassword.component';
import { VendorLineChartComponent } from './Vendor-line-chart/vendor-line-chart.component';
import { FeedbackResponseComponent } from './FeedbackResponse/FeedbackResponse.component';
//import { DragDropModule } from '@angular/cdk/drag-drop';
// Import angular-fusioncharts
import { FusionChartsModule } from 'angular-fusioncharts';
// import { NgxSortableModule } from 'ngx-sortable';
// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RecordingsCatalogTestComponent } from './SurveyApplication/Catalog/recordings-catalog-test/recordings-catalog-test.component';
import { StaticRatingStarComponent } from './StaticRatingStar/static-rating-star.component';
import { RecordingsCatalogIRequested2Component } from './SurveyApplication/Catalog/recordings-catalog-irequested2/recordings-catalog-irequested2.component';
import { RecordingsCatalogIDid2Component } from './SurveyApplication/Catalog/recordings-catalog-idid2/recordings-catalog-idid2.component';
import { RecordingsCatalogForMyReview2Component } from './SurveyApplication/Catalog/recordings-catalog-for-my-review2/recordings-catalog-for-my-review2.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';
import { MyRecordingsComponent } from './SurveyApplication/Catalog/my-recordings/my-recordings.component';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MyCatalogReviewComponent } from './SurveyApplication/Catalog/my-catalog-review/my-catalog-review.component';

import { Test1Component } from './test1/test1.component';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Test2Component } from './test2/test2.component';
import { TermsAndConditionsComponent } from './SurveyApplication/CommonComponent/terms-and-conditions/terms-and-conditions.component';
import { SampleQuestionsComponent } from './SurveyApplication/sample-questions/sample-questions.component';
import { MyQuestionsTabComponent } from './SurveyApplication/CommonComponent/my-questions-tab/my-questions-tab.component';
import { CommonRecordingCatalogComponent } from './SurveyApplication/CommonComponent/common-recording-catalog/common-recording-catalog.component';
import { RecordingCatalogTypesComponent } from './SurveyApplication/CommonComponent/recording-catalog-types/recording-catalog-types.component';
import { AllNotificationsComponent } from './SurveyApplication/CommonComponent/all-notifications/all-notifications.component';
import { SendMessageModalComponent } from './SurveyApplication/CommonComponent/send-message-modal/send-message-modal.component';
import { UserCatalogModalComponent } from './SurveyApplication/CommonComponent/user-catalog-modal/user-catalog-modal.component';
import { ReplayPlayerModalComponent } from './SurveyApplication/CommonComponent/replay-player-modal/replay-player-modal.component';
//import { NgxSpinnerModule } from "ngx-spinner";
import { ComplianceCatalogComponent } from './SurveyApplication/Catalog/compliance-catalog/compliance-catalog.component';
import { EmployeeSurveyCatalogComponent } from './SurveyApplication/Catalog/employee-survey-catalog/employee-survey-catalog.component';
import { SecurityCatalogComponent } from './SurveyApplication/Catalog/security-catalog/security-catalog.component';
import { VendorManagementCatalogComponent } from './SurveyApplication/Catalog/vendor-management-catalog/vendor-management-catalog.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);
import 'chartjs-plugin-labels';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { AuthGuard } from './authentication/auth.guard';
import { SurveyAppModule } from './survey-app/survey-app.module';
import { TestUserInterceptor } from './interceptors/test-user.interceptor';
import { UnsavedChangesGuard } from './authentication/unsaved-changes.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ErrorMessagesService } from './services/error-messages.service';
//import { SurveyAppsModule } from './survey-apps/survey-apps.module';
import {MatStepperModule} from '@angular/material/stepper';
@NgModule({
  declarations: [
    AppComponent,
    Test1Component,
    Test2Component,
    
    VideojsRecordComponent,
    SurveyApplicationComponent, SurveyStartComponent, LoginComponent, SurveyRecordComponent, Test2Component,
    SurveyCompleteComponent, IntroVideoComponent, DashboardComponent, RecordingComponent,
    InboxComponent, RecordingRequestComponent, RequestedByMeComponent, FeedbackResponseComponent,
    RecordingsCatalogIRequestedComponent, RequestsFromMeComponent,RecordingsCatalogIDidComponent,
    RecordingsCatalogForMyReviewComponent, MyQuestionsComponent,RecordingReviewComponent, TeamMembersComponent,
    ChangePasswordComponent, SavedRequestsComponent, EditProfileComponent, ConfirmationCodeComponent,
    ForgotPasswordComponent, ResetPasswordComponent, SecureURLComponent, RegistMsgComponent, VendorLineChartComponent, SignUpComponent, RecordingsCatalogTestComponent, StaticRatingStarComponent, 
    RecordingsCatalogIRequested2Component, RecordingsCatalogIDid2Component, RecordingsCatalogForMyReview2Component, MyRecordingsComponent, MyCatalogReviewComponent, TermsAndConditionsComponent, SampleQuestionsComponent, MyQuestionsTabComponent, CommonRecordingCatalogComponent, RecordingCatalogTypesComponent, AllNotificationsComponent, SendMessageModalComponent, UserCatalogModalComponent, ReplayPlayerModalComponent,
    ComplianceCatalogComponent,EmployeeSurveyCatalogComponent,SecurityCatalogComponent,VendorManagementCatalogComponent, BarChartComponent, DoughnutChartComponent, PageNotFoundComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    RouterModule,
    //HttpModule,
    NgbModule,
    MatTabsModule,
    FormsModule,
    TooltipModule.forRoot(),
    ArchwizardModule,
   
    MatDialogModule,
    ReactiveFormsModule, ArchwizardModule,
    CommonModule/*, DataTablesModule*/, NgSelectModule, FusionChartsModule, Ng2SearchPipeModule,ChartsModule,
    
    BrowserAnimationsModule, AutocompleteLibModule, MatStepperModule, ToastrModule.forRoot({
      timeOut: 1000,
      //progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
    }), //SurveyAppsModule
    //AutocompleteLibModule
  ],
  providers: [AuthGuard,{ provide: LocationStrategy, useClass: HashLocationStrategy},
    // { provide: HTTP_INTERCEPTORS, useClass: TestUserInterceptor,multi:true},
    ],
  
    bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    console.log('app module loaded')
  }
}
