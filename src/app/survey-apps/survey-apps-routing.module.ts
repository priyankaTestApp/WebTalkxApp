import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RecordingRequestComponent } from '../SurveyApplication/Ask/RecordingRequest/RecordingRequest.component';
import { RecordingComponent } from '../SurveyApplication/Record/RecordingComponent/RecordingComponent.component';
import { RequestedByMeComponent } from '../SurveyApplication/Record/RequestedByMe/RequestedByMe.component';
import { RecordingsCatalogIRequestedComponent } from '../SurveyApplication/Catalog/RecordingsCatalogIRequested/RecordingsCatalogIRequested.component';
import { InboxComponent } from '../SurveyApplication/Inbox/Inbox.component';
import { RecordingReviewComponent } from '../SurveyApplication/RecordingReview/RecordingReview';
import { ChangePasswordComponent } from '../SurveyApplication/Password/ChangePassword/ChangePassword.component';

import { RequestsFromMeComponent } from '../SurveyApplication/Record/RequestsFromMe/RequestsFromMe.component';
import { RecordingsCatalogIDidComponent } from '../SurveyApplication/Catalog/RecordingsCatalogIDid/RecordingsCatalogIDid.component';
import { RecordingsCatalogForMyReviewComponent } from '../SurveyApplication/Catalog/RecordingsCatalogForMyReview/RecordingsCatalogForMyReview.component';
import { MyQuestionsComponent } from '../SurveyApplication/Ask/MyQuestions/MyQuestions.component';
import { SavedRequestsComponent } from '../SurveyApplication/Ask/SavedRequests/SavedRequests.component';
import { EditProfileComponent } from '../SurveyApplication/EditProfile/EditProfile.component';
import { TeamMembersComponent } from '../SurveyApplication/TeamMembers/TeamMembers.component';
import { FeedbackResponseComponent } from '../FeedbackResponse/FeedbackResponse.component';
import { RecordingsCatalogTestComponent } from '../SurveyApplication/Catalog/recordings-catalog-test/recordings-catalog-test.component';

import { RecordingsCatalogIRequested2Component } from '../SurveyApplication/Catalog/recordings-catalog-irequested2/recordings-catalog-irequested2.component';
import { RecordingsCatalogIDid2Component } from '../SurveyApplication/Catalog/recordings-catalog-idid2/recordings-catalog-idid2.component';
import { RecordingsCatalogForMyReview2Component } from '../SurveyApplication/Catalog/recordings-catalog-for-my-review2/recordings-catalog-for-my-review2.component';
import { MyRecordingsComponent } from '../SurveyApplication/Catalog/my-recordings/my-recordings.component';
import { MyCatalogReviewComponent } from '../SurveyApplication/Catalog/my-catalog-review/my-catalog-review.component';
import { StaticRatingStarComponent } from '../StaticRatingStar/static-rating-star.component';
import { SampleQuestionsComponent } from '../SurveyApplication/sample-questions/sample-questions.component';
import { ComplianceCatalogComponent } from '../SurveyApplication/Catalog/compliance-catalog/compliance-catalog.component';
import { EmployeeSurveyCatalogComponent } from '../SurveyApplication/Catalog/employee-survey-catalog/employee-survey-catalog.component';
import { SecurityCatalogComponent } from '../SurveyApplication/Catalog/security-catalog/security-catalog.component';
import { VendorManagementCatalogComponent } from '../SurveyApplication/Catalog/vendor-management-catalog/vendor-management-catalog.component';
import { SurveyApplicationComponent } from '../SurveyApplication/SurveyApplication.component';
import { DashboardComponent } from '../SurveyApplication/Dashboard/Dashboard.component';
import { UnsavedChangesGuard } from '../authentication/unsaved-changes.guard';




  const surveyRoutes: Routes = [
    {
      path: '',
      component: SurveyApplicationComponent,
      children: [
        { path: 'RecordingRequest', component: RecordingRequestComponent ,canDeactivate:[UnsavedChangesGuard]},
        { path: 'RecordingRequest/:id', component: RecordingRequestComponent },
        //{ path: 'RecordingRequest/:id/:Type', component: RecordingRequestComponent },
        { path: 'Dashboard', component: DashboardComponent },
        { path: 'RequestsByMe', component: RequestedByMeComponent },
        { path: 'RequestsFromMe', component: RequestsFromMeComponent },
        { path: 'MyNetwork', component: TeamMembersComponent },
        { path: 'Inbox', component: InboxComponent },
        { path: 'RecordingsCatalogByMe', component: RecordingsCatalogIRequestedComponent },
        { path: 'RecordingsCatalogFromMe', component: RecordingsCatalogIDidComponent },
        { path: 'RecordingsCatalogForMyReview', component: RecordingsCatalogForMyReviewComponent },
        { path: 'HiringRecordings', component: RecordingsCatalogTestComponent },
        { path: 'I2BHost', component: RecordingComponent },
        { path: 'RecordingReview', component: RecordingReviewComponent },
        { path: 'MyQuestions', component: MyQuestionsComponent },
        { path: 'ChangePassword', component: ChangePasswordComponent },
        { path: 'SavedRequests', component: SavedRequestsComponent },
        { path: 'EditProfile', component: EditProfileComponent },
        { path: 'Feedback', component: FeedbackResponseComponent },
        { path: 'ReferenceRecordings', component: RecordingsCatalogIRequested2Component },
        { path: 'OfflineMeetingsRecordings', component: RecordingsCatalogIDid2Component },
        { path: 'MarketResearchRecordings', component: RecordingsCatalogForMyReview2Component },
        { path: 'MyRecordings', component: MyRecordingsComponent },
        { path: 'ReviewerCatalog', component: MyCatalogReviewComponent },
       
       
        { path: 'SampleQuestions', component: SampleQuestionsComponent },
        { path: 'ComplianceRecordings', component: ComplianceCatalogComponent },
        { path: 'EmployeeSurveyRecordings', component: EmployeeSurveyCatalogComponent },
        { path: 'SecurityRecordings', component: SecurityCatalogComponent },
        { path: 'VendorManagementRecordings', component: VendorManagementCatalogComponent },
       
    
      ]
    }
    
    
];

@NgModule({
  imports: [RouterModule.forChild(surveyRoutes)],
  exports: [RouterModule]
})
export class SurveyAppsRoutingModule {
  constructor(){
    console.log('survey all appssss loaded')
  }
 }
