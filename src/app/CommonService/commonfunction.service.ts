import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
//import {BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { FiledValue } from './commonfunction.model';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { GlobalVariable } from '../globals';
import { Observable } from 'rxjs';


@Injectable()
export class CommonService {
  EngagementAreaList: FiledValue[];
  StateList: FiledValue[];
  IndustryList: FiledValue[];
  EngagementScopeList: FiledValue[];
  EngagementTypeList: FiledValue[];
  EngagementCategoryList: FiledValue[];
  SubIndustryList: FiledValue[];
  EngagementSizeList: FiledValue[];
  RevenueScaleList: FiledValue[];
  NumberOfEmployeesList: FiledValue[];
  questionList: FiledValue[];

  stepsTourShown = false;

  dialogModal = false;
  //startTourEvent: BehaviorSubject<any> = new BehaviorSubject<string>('');

  constructor(private httpc: HttpClient, private http: Http) { }


  //get Messages by user ID
  GetMessages(select_uid, uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Messages/GetMessages?UserID=' + select_uid + '&LoginUserID=' + uid);
  }

  //get Messages by user ID
  InsertMessages(msg) {
    
    return this.httpc.post(GlobalVariable.APIUrl + 'Messages/InsertMessages', msg);
  }

  //Method to update the hubspot user role
  UpdateUserRole(userobj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'HubSpot/UpdateRole ', userobj);
  }

  //get notification by user id
  GetNotifications(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Notification/GetNotifications?UserID=' + uid);
  }

  //Method to delete the message
  DeleteNotification(notification) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'Notification/DeleteNotifications', notification).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'Notification/DeleteNotifications', notification);
  }

  //get Messages by user ID
  GetCompanyUser(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Users/GetSameCompanyUserByUserID?UserID=' + uid);
  }

  //get user name for message
  GetCompanyUserForMessage(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Users/GetSameCompanyUserForInbox?UserID=' + uid);
  }

  //get user name for message
  GetUsersForInbox(userObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/GetUsersForInbox', userObj);
  }


 // get unread notification by user id
  GetUnReadNotifications(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Notification/GetUnReadNotificationsCount?UserID=' + uid);
  }

//  Method to read the notofication
  ReadNotification(notification) {
   // return this.httpc.put(GlobalVariable.APIUrl + 'Notification/ReadNotification', notification).map(res => res);
   return this.httpc.put(GlobalVariable.APIUrl + 'Notification/ReadNotification', notification);
  }

  //get unread notification by user id for I2B
  GetUnReadNotificationsI2B(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BNotifications/GetUnReadNotificationsCount?UserID=' + uid);
  }

  //Method to read the notofication for I2B
  ReadNotificationI2B(notification) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'I2BNotifications/ReadNotification', notification).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BNotifications/ReadNotification', notification);
  }

  //get notification by user id
  GetNotificationsI2B(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BNotifications/GetNotifications?UserID=' + uid);
  }

  //Method to read the message
  ReadMessageI2B(message) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'Messages/ReadMessage', message).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BMessages/ReadMessage', message);
  }


  //Method to read the message
  ReadMessage(message) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'Messages/ReadMessage', message).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'Messages/ReadMessage', message);
  }

  //get unread message by user id
  GetUnReadMessagesI2B(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BMessages/GetUnReadMessageCount?UserID=' + uid);
  }

  //get unread message by user id
  GetUnReadMessages(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Messages/GetUnReadMessageCount?UserID=' + uid);
  }

  //Insert messages
  InsertMessagesI2B(msg) {
    debugger;
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BMessages/InsertMessages', msg);
  }

  //get Messages by user ID
  GetMessagesI2B(select_uid, uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BMessages/GetMessages?UserID=' + select_uid + '&LoginUserID=' + uid);
  }

  //Method to send the message to user
  SendMessage(content) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Messages/InsertMessages', content);
  }

  //get team member by user id
  GetTeamMembers(userObj) {
    //return this.httpc.get(GlobalVariable.APIUrl + 'Members/GetVendorMembers?UserID=' + uid);
    return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/GetUsersForInbox', userObj);
  }

  //get reviewer team member by user id
  GetReviewerTeamMembers(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Members/GetReviewerMembers?UserID=' + uid);
  } 

  // GetQuestionnaireQuestions(Id: number) {
  //   return this.http.get(GlobalVariable.APIUrl + 'RefRequestEngFactQues/GetRefRequestEngFactQues?RefRequestID=' + Id).map((data: Response) => {
  //     return data.json() as FiledValue[];
  //   }).toPromise().then(x => {
  //     this.questionList = x;
  //   })
  // }

  //get the Company details by user id
  GetCompanyDetailsById(id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Common/GetBusinessDetails?BusinessID=' + id);
  }

  GetCommentByRefRequest(id) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Comments/GetCommentByRefRequest?RefRequestID=' + id);
  }

  GetreviewerDetailsByUserID(Id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Reviewer/GetReviewerByID?UserID=' + Id);
  }

  ReviewerProfileSave(requester) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'Reviewer/UpdateReviewerDetails', requester);
    return this.httpc.put(GlobalVariable.APIUrl + 'Reviewer/EditReviewerDetails', requester);
  }

  postFile(Id: number, fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('UserID', Id.toString());
    return this.httpc.post(GlobalVariable.APIUrl + '/Image/UploadImage', formData);
  }

  //Method to delete the valuation share record
  deleteShareComments(cmt) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'Valuation/DeleteValuations', cmt).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'Valuation/DeleteValuations', cmt);
  }

  //for getting the infoPack details (common call of a service for all the personas according to the userID)
  getInfoPackDetails(id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'InfoPack/GetInfoPackDetails?UserID=' + id);
  }

  //get Messages by user ID
  InsertShareInstruction(inst) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Valuation/InsertSharingInstruction', inst);
  }

  //Method to get the share instruction
  GetShareInstructions(rid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Valuation/GetSharedInstructions?RefRequestID=' + rid);
  }

  //Method to update the sharing instruction
  UpdateShareInstruction(inst) {
    return this.httpc.put(GlobalVariable.APIUrl + 'Valuation/UpdateSharingInstruction', inst);
  }

  //Method to delete the valuation share record
  deleteShareInstComments(cmt) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'Valuation/DeleteSharingInstruction', cmt).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'Valuation/DeleteSharingInstruction', cmt);
  }
  
  //get the questions
  GetRefRequestQuestions(Id: number) {

    // return this.http.get(GlobalVariable.APIUrl + 'RefRequestEngFactQues/GetRefRequestEngFactQues?RefRequestID=' + Id).map((data: Response) => {
    //   return data.json();
    // }).toPromise().then(x => {
    //   this.questionList = x;
    // })
  }

  //Method to get and show the recording headlines
  GetRecordingHeadline(id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RefRequest/GetRecodingReviewHeadline?RefRequestID=' + id);
  }

  //Method to get the recording details
  GetRecordingDetails(RefRequestID: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RequesterRecording/GetRefRecordingsByRefRequestID?RefRequestID=' + RefRequestID);
  }

  //service method to get all script
  GetAllQuestionsScript(RefReqId) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RequesterRecording/GetRecodingScriptByRefRequestID?RefRequestID=' + RefReqId);
  }

  //services to get selected question's script
  GetQuestionsScript(qid, RefReqId) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Search/GetAnswerByQuestionID?QuestionID=' + qid + '&RefRequestID=' + RefReqId);
  }

  //service method to search text by keyword
  KeywordSearch(val, id) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Search/SearchResult?SearchText=' + val + '&RefRequestID=' + id);
  }

  //get engagment facts
  GetEngagementfacts(ids: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RefRequestEngFact/GetRefRequestEngFact?RefRequestID=' + ids);
  }

  //Method to get the reference request
  GetRequestDetailsById(Id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RefRequest/GetRefRequestByID?RefRequestID=' + Id);
  }

  //Method to approve the recording
  RecordingCatalogAction(requester: any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'RefRequestApproval/InsertRefRequestApproval', requester);
  }

  // Insert rejection reasion
  InsertRejectionReasion(requester: any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Comments/InsertRejectionReasion', requester);
  }

  //Method to insert the bookmark
  InsertBookmark(bookmarkobj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Bookmark/InsertBookmark', bookmarkobj);
  }

  //Method to get the bookmark
  GetBookmark(rid, uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Bookmark/GetBookmarks?RefRequestID=' + rid + '&UserID=' + uid);
  }

  //Method to get the notes
  GetNotes(notesobj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BNotes/GetRecordingRequestNotes', notesobj);
  }
  
  //Method to insert the notes
  InsertMyNotes(notesobj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BNotes/InsertUserNote', notesobj);
  }

  //Method to delete notes
  DeleteNotes(notes) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BNotes/DeleteUserNote', notes);
  }

  //Method to delete notes
  DeleteQuestions(quesObj) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/DeleteQuestionFromUserQuestionnare', quesObj);
  }

  //Method to update the notes
  UpdateMyNotes(notesobj) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BNotes/UpdateUserNote', notesobj);
  }

  DeleteBookmark(bookmark) {
    //bookmark.AuthorID = 0;
    //return this.httpc.put(GlobalVariable.APIUrl + 'Bookmark/DeleteRecodingBookmark', bookmark).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'Bookmark/DeleteRecodingBookmark', bookmark);
  }

  //Method to update the notes
  UpdateNotes(notesobj) {
    return this.httpc.put(GlobalVariable.APIUrl + 'Bookmark/UpdateNotes', notesobj);
  }

  // Insert comments
  InsertComment(requester: any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Comments/InsertComments', requester);
  }

  //service For Comment's (valuation Rating circleFormat)
  addComments(comment: Comment) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Valuation/InsertValuationDetails', comment);
  }

  //service For getting the comments and circleRate (valuation Rating circleFormat)
  GetCircleRate(cid: number, userid: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Valuation/GetValuationsByUser?RefRequestID=' + cid + '&UserID=' + userid);
  }

  //sevice for line chart data on dashboaed page.
  LineChartData() {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetLineChartData');
  }

  //sevice for line chart data on dashboaed page.
  VendorLineChartData(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetLineChartDataForVendor?UserID='+ uid);
  }

  //sevice for line chart data on dashboaed page.
  GiverLineChartData(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetLineChartDataForGiver?UserID='+ uid);
  }

  //sevice for line chart data on dashboaed page.
  ReviewerLineChartData(uid) {
    
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetLineChartDataForReviewer?UserID='+ uid);
  }

  //Method to add the company logo (common service)
  UploadCompanyLogo(Id: number, logoFileToUpload: File, bId: number) {
    const formData: FormData = new FormData();

    formData.append('AuthorID', String(Id));
    if (logoFileToUpload && logoFileToUpload.name)  formData.append('Image', logoFileToUpload, logoFileToUpload.name);
    if (bId) formData.append('BusinessID', String(bId));

    return this.http.post(GlobalVariable.APIUrl + 'Image/UploadCompanyLogo', formData);
  }

  //for getting the same company user's
  GetSameCompanyUser(id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Users/GetSameCompanyUserByUserId?UserId=' + id);
  }

  //sevice for pie-chart data on dashboard page for engagement facts.
  EngagementPiChartDetails() {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetEngagementPiChartDetails');
  }

  //sevice for pie-chart data on dashboard page for engagement facts.
  VendorEngagementPiChartDetails(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetEngagementPiChartDetailsForVendor?UserID='+ uid);
  }
  
  //sevice for pie-chart data on dashboard page for engagement facts.
  GiverEngagementPiChartDetails(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetEngagementPiChartDetailsForGiver?UserID='+ uid);
  }

  //sevice for pie-chart data on dashboard page for engagement facts.
  ReviewerEngagementPiChartDetails(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetEngagementPiChartDetailsForReviewer?UserID='+ uid);
  }

  //sevice for pie-chart data on dashboard page for industrys
  IndustryPiChartData() {
    return this.httpc.get(GlobalVariable.APIUrl + 'Chart/GetIndustryPiChartData');
  }

  //sevice for get line data on dashboard page for vendor
  VendorCharityData(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Charity/GetCharityDetailsByVendor?UserID=' + uid);
  }

  //sevice for get line data on dashboard page for giver
  GiverCharityData(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Charity/GetCharityDetailsByGiver?UserID=' + uid);
  }
  
  //Methgod to disconnect the connection
  EndArchiving(param) {
    return this.httpc.put(GlobalVariable.APIUrl + 'RecordingArchive/EndArchiving', param);
  }

  //Method to insert the reviewer
  ShareReviewerRefRecording(requester) {
    return this.httpc.post(GlobalVariable.APIUrl + 'RefRequestReviewer/ShareRefRequestByReviewer', requester);
  }

  //Method to send the bookmark and notes
  ShareReviewerBookmarkAndNotes(requester: any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'RefRequestReviewer/ReviewerSharedBookmarkAndNotes', requester);
  }

  GetShareBookmarkNotesByReviewer(rid, uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Bookmark/GetBookmarksNotesForSharingByReviewer?RefRequestID=' + rid + '&UserID=' + uid);
  }

  //Method to get the same company reviewer by user id
  GetSameCompanyReviewerById(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Users/GetSameCompanyReviewerByUserID?UserID=' + uid);
  }

//Method to the charity data of giver at user charity page
  GetUserCharityData(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Charity/GetUserCharity?UserID=' + uid);
  }

  //method to update the userCharity
  updateUserCharity(giver) {
    return this.httpc.put(GlobalVariable.APIUrl + 'Charity/UpdateUserCharityDetails', giver);
  }

  //method to get userchairty transactions
  transactionUserCharity(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Charity/GetCharityTransactionDetails?UserID=' + uid);
  }

  //Method to send the info pack
  SendInfoPack(detailInfo) {
    return this.httpc.post(GlobalVariable.APIUrl + 'InfoPack/InsertSentInfoPackDetails', detailInfo);
  }

  //Method to get the shared history
  GetSharedHistory(id: number) {
    //return this.httpc.get(GlobalVariable.APIUrl + 'RecordingShareHistory/GetSharedHistory?RefRequestID=' + id);
    return this.httpc.get(GlobalVariable.APIUrl + 'I2B_RecordingShareHistory/GetSharedHistory?RefRecordingID=' + id);

  }

  //Method to sent the info pack
  ReferUsInfoPacks(requester) {
    return this.httpc.post(GlobalVariable.APIUrl + 'InfoPack/ReferUsInfoPackDetails', requester);
  }

  // Method to create reviewer from reviewer catalog page.
  CreateNewReviewerForShare(requester: any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Reviewer/InsertReviewerByReviewer', requester);
  }

  //get the user by email id
  GetUserByEmail(email: string) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Users/GetUserByEmail?Email=' + email);
  }

  //Method to upload the document file
  UploadEngagementDocs(Id: number, fileToUpload: File, refId: number) {
    const formData: FormData = new FormData();

    formData.append('EngagementDocs', fileToUpload, fileToUpload.name);
    if (Id) formData.append('UserID', Id.toString());
    if (refId) formData.append('RefRequestID', refId.toString());
    
    return this.httpc.post(GlobalVariable.APIUrl + 'DocumentUpdate/UploadEngagementDocs', formData);

    //let body = JSON.stringify(emp);
    /*let headerOptions = new Headers({ "Content-Type": "text/plain;charset=UTF-8" });
    let requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });

    return this.http.post(GlobalVariable.APIUrl + 'DocumentUpdateController/UploadEngagementDocs', formData, requestOptions).map(
      x => x.json().catch(this.handleError)
    );*/
  }


  //Handle the error 
  public handleError(error: any) {
    return Observable.throw(error.json());
  }


  //get the document id
  GetRecordingRequestDocument(id: number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RefRequest/GetRecordingRequestDocument?RefRequestID=' + id);
  }

  //get the filter selected options
  getFilterSelectedOptions(u_id, cat_Id) {
    return this.httpc.get(GlobalVariable.APIUrl + 'CatalogSetting/GetCatalogSetting?UserID=' + u_id + '&CatalogID=' + cat_Id);
  }

  //insert the catalogSetting
  insertCatalogSetting(catalog_Setting) {
    return this.httpc.post(GlobalVariable.APIUrl + 'CatalogSetting/InsertCatalogSetting', catalog_Setting);
  }

  /// Function for get Engagement scope
  GetEngagementScope() {

    // return this.http.get(GlobalVariable.APIUrl + 'Engagement/GetEngagementScopes').map((data: Response) => {
    //   return data.json() as FiledValue[];
    // }).toPromise().then(x => {
    //   this.EngagementScopeList = x;
    // })
  }

  /// Function for get Engagement type
  GetEngagementType(index) {

    // return this.http.get(GlobalVariable.APIUrl + 'Engagement/GetEngagementTypeByScope?EngagementScope=' + index).map((data: Response) => {
    //   return data.json() as FiledValue[];
    // }).toPromise().then(x => {
    //   this.EngagementTypeList = x;
    // })
  }

  /// Function for get Engagement type
  GetEngagementCategory(index) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Engagement/GetEngagementCategoryByType?EngagementType=' + index);
  }

  /// Function for get Engagement facts
  GetEngagementFacts(index) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Engagement/GetEngagementFactsByScope?EngagementScope=' + index);
  }

  //Method to getting the hubspot users details
  GetAppUserDetailsByEmailAndToken(email, token) {
    return this.httpc.get(GlobalVariable.APIUrl + 'HubSpot/GetHubSpotUserByEmail?email=' + email + '&token=' + token);
  }

  //get Dashboard data by user ID
  I2BDashboardData(uid) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BDashboard/GetUserDashboard', uid);
  }

  //FeedBack data Save 
  I2BFeedback(obj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/InsertRecordingFeedBack', obj);
  }


  //for setting a cookie
  setCookie(cname, cvalue, exdays?: any) {
    document.cookie = cname + '=' + cvalue + ';path=/';
  }

  //getTranscript
  I2BTranscript(obj) {
    return this.httpc.post(GlobalVariable.APIUrl + '/I2BRecordingRequest/GetQuestionTranScript', obj);
  }

  //Delete recordings
  DeleteRecordingRequests(recordObj) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/DeleteRecordingRequest', recordObj);
  }

  //for getting a cookie
  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  //for checking a cookie
  checkCookie(cookie) {
    const user = this.getCookie(cookie);
    if (user !== '') {
      return true;
    } else {
      return false;
    }
  }
}
