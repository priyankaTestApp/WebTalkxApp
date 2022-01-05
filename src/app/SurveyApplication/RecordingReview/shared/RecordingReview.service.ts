import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { recordingreviewmodel } from './RecordingReview.model';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { GlobalVariable } from '../../../globals';

@Injectable()
export class I2BApplicationRecordingReviewService {
  ModelProfile: recordingreviewmodel;
  recordingList: recordingreviewmodel[];
  questionList: recordingreviewmodel[];

  constructor(private httpc: HttpClient, private http: Http) { }
  

  GetRefRequestQuestions(ReferenceObj) {
    
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestQuestions', ReferenceObj);
  }

  RecordingCatalogAction(requester: recordingreviewmodel) {
    
    return this.httpc.put(GlobalVariable.APIUrl + 'RefRequestReviewer/UpdateRefRequestReviewerApproval', requester);
  }

  GetRecordingDetails(RefRequestObj) {
        
    //return this.httpc.get(GlobalVariable.APIUrl + 'RequesterRecording/GetRefRecordingsByRefRequestID?RefRequestID=' + RefRequestID);
    return this.httpc.post(GlobalVariable.APIUrl + '/I2BRecordingRequest/GetAssignedRequestDetails', RefRequestObj);
  }
  

  GetRequestDetailsById(Id: number) {
   
    return this.httpc.get(GlobalVariable.APIUrl + 'RefRequest/GetRefRequestByID?RefRequestID=' + Id);
  }

  GetEngagementfacts(ids: number) {
    
    return this.httpc.get(GlobalVariable.APIUrl + 'RefRequestEngFact/GetRefRequestEngFact?RefRequestID=' + ids);
  }
   
  // Insert comments
  InsertComment(requester: recordingreviewmodel) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Comments/InsertComments', requester);
  }

  // Insert rejection reasion
  InsertRejectionReasion(requester: recordingreviewmodel) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Comments/InsertRejectionReasion', requester);
  }

  //service method to search text by keyword
  KeywordSearch(val, id) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BRecordingRequest/SearchResult?SearchText=' + val + '&RefRequestID=' + id);
  }


  //services to get selected question's script
  GetQuestionsScript(qid, RefReqId) {
    //qid = 40;
    return this.httpc.get(GlobalVariable.APIUrl + 'Search/GetAnswerByQuestionID?QuestionID=' + qid + '&RefRequestID=' + RefReqId);
  }

  //service method to get all script
  GetAllQuestionsScript(RefReqId) {
    return this.httpc.get(GlobalVariable.APIUrl + 'RequesterRecording/GetRecodingScriptByRefRequestID?RefRequestID=' + RefReqId);
  }
  
  //service method to get all script
  GetURLStatus(urlobj) { 

    return this.httpc.post(GlobalVariable.APIUrl + '/RecordRTC/CheckMP4Videos', urlobj);
  }
  
  //Method to insert the bookmark
  InsertBookmark(bookmarkobj) {
    return this.httpc.post(GlobalVariable.APIUrl + '/Bookmark/InsertBookmark', bookmarkobj);
  }

  //Method to get the bookmark
  GetBookmark(rid, uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Bookmark/GetBookmarks?RefRequestID=' + rid + '&UserID=' + uid);
  }

  DeleteBookmark(bookmark) {
    bookmark.AuthorID = 0;
    //return this.httpc.put(GlobalVariable.APIUrl + '/Bookmark/DeleteRecodingBookmark', bookmark).map(res => res);
  }

  UpdateNotes(notesobj) {
    return this.httpc.put(GlobalVariable.APIUrl + '/Bookmark/UpdateNotes', notesobj);
  }

  GetRecordingHeadline(refObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestUserDetails', refObj);
  }

  //service For Comment's
  addComments(comment: Comment) {
    return this.http.post(GlobalVariable.APIUrl + 'Valuation/InsertValuationDetails', comment);
  }

  //service For getting the comments and circleRate (valuation Rating circleFormat)
  GetRatedValue(reqid, uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'Valuation/GetValuationsByUser?RefRequestID=' + reqid + '&UserID=' + uid);
  }
  
  // Service for get shared bookmarks
  GetSharedBookmark(rid, revid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'ShareRequest/GetSharedBookmarks?RefRequestID=' + rid + '&ReviewerID=' + revid);
  }
  
  //service for getting the shared notes
  GetSharedNotes(rid, revid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'ShareRequest/GetSharedNotes?RefRequestID=' + rid + '&ReviewerID=' + revid);
  }

  //service for the replay count's
  replayCount(revobj: any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'Replay/AddReplayCountByOne', revobj);
  }



}


