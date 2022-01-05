import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../../globals';


@Injectable()
export class StaticStarRatingService {
  constructor(private http: HttpClient) { }

  //SendInfoPack(requester: infopackmodel) {
  //  debugger;   
  //  return this.http.post(GlobalVariable.APIUrl + 'InfoPack/SendInfoPack', requester);

  //}

  //Insertinfo(requester: infopackmodel) {
  //  return this.http.post(GlobalVariable.APIUrl + 'InfoPack/SendInfoPack', requester);
  //}

}
